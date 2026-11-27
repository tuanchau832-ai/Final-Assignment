"""Authenticated station management and measurement-backed analysis."""
import hashlib
import json
import os
from contextlib import contextmanager
from typing import Annotated, Literal
from uuid import UUID

from fastapi import Request
from pydantic import Field, StringConstraints, ValidationError, field_validator
from sqlalchemy import and_, func, or_, select, text
from sqlalchemy.exc import IntegrityError

from .models import AdminAudit, Alert, Device, FrameRow, Measurement, Sensor, Session, Station, User
from .schemas import Strict
from .service import Problem, ROOT, dt, stamp

ShortText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
Reason = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)]
State = Literal['active', 'maintenance', 'archived']


class Command(Strict):
    request_id: UUID
    confirmed: bool = Field(strict=True)

    @field_validator('confirmed')
    @classmethod
    def require_confirmation(cls, value):
        if not value:
            raise ValueError('Confirmation required')
        return value


class CreateStation(Command):
    code: str = Field(pattern=r'^HWW-[A-Z]{3}-[0-9]{3}$')
    name_en: ShortText
    name_vi: ShortText
    river: ShortText
    lat: float = Field(strict=True, ge=-90, le=90)
    lng: float = Field(strict=True, ge=-180, le=180)
    data_mode: Literal['planned', 'replay']
    reason: Reason


class ChangeLifecycle(Command):
    lifecycle: State
    previous: State
    reason: Reason


class SendAnnouncement(Command):
    audience: Literal['all', 'operator', 'reviewer', 'admin']
    message: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=1600)]


def validate(model, body):
    try:
        return model.model_validate(body)
    except ValidationError as error:
        raise Problem(422, 'validation_error', error.errors()[0]['msg'])


@contextmanager
def write_transaction(service):
    with service.lock, service.DB.begin() as db:
        if db.bind.dialect.name == 'sqlite':
            db.execute(text('BEGIN IMMEDIATE'))
        yield db


def receipt(db, actor, action, command, station=None):
    # Lock the actual sender across workers before assigning an idempotency receipt.
    user = db.scalar(select(User).where(User.username == actor).with_for_update())
    if not user or not user.is_active:
        raise Problem(401, 'unauthenticated')
    if user.role != 'admin':
        raise Problem(403, 'forbidden')
    encoded = json.dumps([action, station, command.model_dump(mode='json')], sort_keys=True)
    fingerprint = hashlib.sha256(encoded.encode()).hexdigest()
    key = str(command.request_id)
    existing = db.scalar(select(AdminAudit).where(AdminAudit.actor == actor, AdminAudit.request_id == key))
    if existing:
        if existing.fingerprint != fingerprint:
            raise Problem(409, 'request_id_conflict')
        return existing, True
    return AdminAudit(actor=actor, action=action, station=station, at=stamp(), request_id=key,
                      fingerprint=fingerprint), False


def registry_for(command):
    # This registry supplies the four supported sensor channels and their model bindings.
    registry = json.loads((ROOT / 'shared/registry/HWW-NHU-001.json').read_text(encoding='utf-8-sig'))
    registry['station'].update(code=command.code, name={'vi': command.name_vi, 'en': command.name_en},
                               river=command.river, data_mode=command.data_mode,
                               location={'lat': command.lat, 'lng': command.lng, 'precision': 'illustrative'})
    for sensor in registry['sensors']:
        sensor['uid'] = f"{command.code}:{sensor['channel']}"
    return registry


def change_station(service, db, station, audit, command):
    if station.lifecycle != command.previous or station.lifecycle == 'archived' or command.lifecycle == station.lifecycle:
        raise Problem(409, 'invalid_transition')
    audit.reason, audit.before, audit.after = command.reason, station.lifecycle, command.lifecycle
    station.lifecycle = command.lifecycle
    station.monitoring_since = audit.at
    station.status, station.status_since = 'unavailable', audit.at
    station.version += 1
    session = db.scalar(select(Session).where(Session.station == station.code, Session.ended_at.is_(None)))
    if session:
        session.ended_at, session.end_reason = audit.at, command.lifecycle
        service.event(db, station.code, 'session_ended', {'session_id': session.id, 'reason': command.lifecycle}, at=audit.at)
    station.current_session = station.active_device = station.last_frame = station.last_measured = None
    for sensor in db.scalars(select(Sensor).where(Sensor.station == station.code)):
        sensor.status, sensor.status_since = 'unavailable', audit.at
        sensor.value = sensor.quality = sensor.gen = sensor.fault_reason = None
        sensor.measured_at = sensor.received_at = None
        sensor.rule_state, sensor.historical_rule_state = {}, {}
    for episode in db.scalars(select(Alert).where(Alert.station == station.code, Alert.cleared_at.is_(None))):
        episode.cleared_at = audit.at
        service.event(db, station.code, 'monitoring_stopped', {'reason': command.lifecycle},
                      episode.sensor, episode.id, at=audit.at)
    db.add(audit)
    return session.id if session else None


def period_seconds(db, station, start, end):
    """Partition the requested window by audited creation and lifecycle changes."""
    changes = db.scalars(select(AdminAudit).where(AdminAudit.station == station.code,
                        AdminAudit.action.in_(['station_created', 'station_lifecycle']),
                        AdminAudit.at <= stamp(end)).order_by(AdminAudit.at, AdminAudit.id)).all()
    state = 'active' if not changes or changes[0].action != 'station_created' else 'uncommissioned'
    if not changes and db.scalar(select(AdminAudit.id).where(AdminAudit.station == station.code,
                        AdminAudit.action == 'station_created')):
        state = 'uncommissioned'
    cursor = start
    durations = {'active': 0., 'maintenance': 0., 'archived': 0., 'uncommissioned': 0.}
    for change in changes:
        boundary = max(start, dt(change.at))
        durations[state] += (boundary - cursor).total_seconds()
        cursor, state = boundary, change.after
    durations[state] += (end - cursor).total_seconds()
    return durations


def statistics(db, station, channel, start, end):
    lo, hi = stamp(start), stamp(end)
    sensor_uid = f'{station.code}:{channel}'
    window = (Measurement.sensor == sensor_uid, Measurement.measured_at >= lo, Measurement.measured_at < hi)
    samples = db.scalar(select(func.count()).select_from(Measurement).where(*window))
    valid = (*window, Measurement.quality == 'ok')
    count, low, high, mean = db.execute(select(func.count(), func.min(Measurement.value),
        func.max(Measurement.value), func.avg(Measurement.value)).where(*valid)).one()
    ordered = select(Measurement.value).where(*valid)
    first = db.scalar(ordered.order_by(Measurement.measured_at, Measurement.id).limit(1))
    last = db.scalar(ordered.order_by(Measurement.measured_at.desc(), Measurement.id.desc()).limit(1))
    sources = list(db.scalars(select(Measurement.source).where(*window).distinct().order_by(Measurement.source)))
    frames = db.scalar(select(func.count()).select_from(FrameRow).join(Session, Session.id == FrameRow.session)
                       .where(Session.station == station.code, FrameRow.measured_at >= lo, FrameRow.measured_at < hi))
    durations = period_seconds(db, station, start, end)
    expected = int(durations['active'] * 1000 / max(1, int(os.getenv('FRAME_INTERVAL_MS', '2000'))))
    if station.registry['station']['data_mode'] == 'planned':
        expected = 0
    episodes = db.scalar(select(func.count()).select_from(Alert).where(Alert.sensor == sensor_uid,
                         Alert.category == 'water_quality', Alert.opened_at >= lo, Alert.opened_at < hi))
    return dict(station=station.code, lifecycle=station.lifecycle, samples=samples, valid=count, minimum=low,
                maximum=high, mean=mean, first_value=first, last_value=last, received_frames=frames,
                expected_frames=expected, maintenance_seconds=round(durations['maintenance'], 3),
                coverage_pct=min(100, round(frames * 100 / expected, 1)) if expected else None,
                episodes=episodes, sources=sources)


def register_admin(app, service, current, payload, parse_range, metadata, replay_control, restart_tickets, cancel_replay):
    @app.middleware('http')
    async def private_responses(request, call_next):
        response = await call_next(request)
        if request.url.path.startswith('/api/v1/admin/'):
            response.headers['Cache-Control'] = 'private, no-store'
        return response

    @app.get('/api/v1/admin/stations')
    def stations(request: Request):
        current(request, 'admin')
        with service.DB() as db:
            return {'items': [metadata(station) for station in db.scalars(select(Station).order_by(Station.code))]}

    @app.post('/api/v1/admin/stations', status_code=201)
    async def create_station(request: Request):
        actor = current(request, 'admin').username
        command = validate(CreateStation, await payload(request))
        try:
            with write_transaction(service) as db:
                audit, duplicate = receipt(db, actor, 'station_created', command, command.code)
                if duplicate:
                    return metadata(service.station(db, command.code))
                if db.get(Station, command.code):
                    raise Problem(409, 'station_exists')
                registry = registry_for(command)
                station = Station(code=command.code, registry=registry, lifecycle='active', status='unavailable',
                                  status_since=audit.at, monitoring_since=audit.at)
                db.add(station)
                db.flush()
                for sensor in registry['sensors']:
                    db.add(Sensor(uid=sensor['uid'], station=station.code, channel=sensor['channel'],
                                  status='unavailable', status_since=audit.at))
                if command.data_mode == 'replay':
                    db.add(Device(code='replay-' + station.code.lower(), station=station.code, kind='replay'))
                audit.reason, audit.after = command.reason, 'active'
                db.add(audit)
                return metadata(station)
        except IntegrityError:
            raise Problem(409, 'station_exists')

    @app.post('/api/v1/admin/stations/{code}/lifecycle')
    async def lifecycle(code: str, request: Request):
        actor = current(request, 'admin').username
        command = validate(ChangeLifecycle, await payload(request))
        async with replay_control:
            with write_transaction(service) as db:
                station = service.station(db, code, True)
                audit, duplicate = receipt(db, actor, 'station_lifecycle', command, code)
                if duplicate:
                    return metadata(station)
                stopped = change_station(service, db, station, audit, command)
                result = metadata(station)
            restart_tickets.pop(code, None)
            if stopped:
                await cancel_replay(stopped, command.lifecycle)
            return result

    @app.get('/api/v1/admin/audit')
    def audit_history(request: Request):
        current(request, 'admin')
        with service.DB() as db:
            fields = 'id at actor action station reason before after audience recipient_count'.split()
            rows = db.scalars(select(AdminAudit).order_by(AdminAudit.id.desc()).limit(100))
            return {'items': [{key: getattr(row, key) for key in fields} for row in rows]}

    @app.post('/api/v1/admin/announcements')
    async def announce(request: Request):
        from .notifications import publish_announcement
        actor = current(request, 'admin').username
        command = validate(SendAnnouncement, await payload(request))
        with write_transaction(service) as db:
            roles = ['operator', 'reviewer', 'admin'] if command.audience == 'all' else [command.audience]
            # All publishers lock overlapping accounts in username order. Include the
            # sender even when the selected audience excludes administrators.
            eligible = and_(User.is_active.is_(True), User.role.in_(roles))
            accounts = list(db.scalars(select(User).where(or_(User.username == actor, eligible))
                                       .order_by(User.username).with_for_update()))
            audit, duplicate = receipt(db, actor, 'announcement', command)
            if not duplicate:
                recipients = [user.username for user in accounts if user.is_active and user.role in roles]
                audit.audience, audit.recipient_count = command.audience, len(recipients)
                if recipients:
                    audit.notification_id = publish_announcement(db, recipients=recipients, message=command.message,
                                                                  actor=actor, at=audit.at)
                db.add(audit)
            return {'notification_id': audit.notification_id, 'recipient_count': audit.recipient_count,
                    'outcome': 'sent' if audit.recipient_count else 'empty'}

    @app.get('/api/v1/admin/statistics')
    def analyze(request: Request):
        current(request, 'admin')
        start, end = parse_range(request)
        channel = request.query_params.get('channel', 'ph')
        if channel not in service.types:
            raise Problem(422, 'unknown_channel')
        codes = list(dict.fromkeys(code for code in (request.query_params.get('station'),
                                                      request.query_params.get('compare')) if code))
        if not codes:
            raise Problem(422, 'validation_error')
        with service.DB() as db:
            return {'from': stamp(start), 'to': stamp(end), 'unit': service.types[channel]['unit'],
                    'channel': channel, 'is_simulated': True,
                    'items': [statistics(db, service.station(db, code), channel, start, end) for code in codes]}
