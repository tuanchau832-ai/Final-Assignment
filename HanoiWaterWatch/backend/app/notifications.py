"""Station condition transitions and account-scoped, retryable in-app delivery."""
from uuid import UUID

from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy import select, text

from .models import Alert, Measurement, Notification, NotificationDelivery, NotificationInbox, Sensor, User, WaterCondition


def publish(db, notification, audience):
    # Lock recipients in the same order before allocating the event ID. A later
    # event for the same account cannot commit ahead of this one on PostgreSQL.
    names = list(db.scalars(audience.order_by(User.username).with_for_update()))
    db.add(notification)
    db.flush()
    db.add_all(NotificationDelivery(username=name, notification_id=notification.id) for name in names)
    return notification.id


def publish_announcement(db, *, recipients, message, actor, at):
    audience = select(User.username).where(User.is_active.is_(True), User.username.in_(recipients))
    return publish(db, Notification(kind='announcement', at=at, detail={'message': message, 'actor': actor}), audience)


def update_condition(db, station, session, at, *, ready, pending, changes, freshness_window):
    """Called once per frame, after all live sensor evaluations, under the station lock."""
    if not (changes or ready):
        return
    state = db.get(WaterCondition, station.code)
    if state is None:
        state = WaterCondition(station=station.code, session=session.id, sequence=0)
        db.add(state)
    elif state.session != session.id:
        state.session = session.id
        state.condition = None
        state.deferred_alert = None
    if not changes and not state.deferred_alert and (state.condition is not None or pending):
        return
    active = list(db.scalars(select(Alert).where(
        Alert.station == station.code, Alert.session == session.id,
        Alert.category == 'water_quality', Alert.detected_late.is_(False),
        Alert.cleared_at.is_(None), Alert.severity.in_(['warning', 'critical']),
    )))
    condition = 'critical' if any(a.severity == 'critical' for a in active) else 'warning' if active else 'normal'
    if active:
        from .service import dt
        strongest = [db.get(Sensor, a.sensor) for a in active if a.severity == condition]
        # An episode can remain open while its sensor is stale or faulty. An
        # unrelated sensor's recovery cannot turn that into a confirmed level.
        confirmed = any(
            sensor.quality == 'ok' and 0 <= (dt(at) - dt(sensor.measured_at)).total_seconds() <= freshness_window
            and db.scalar(select(Measurement.id).where(
                Measurement.sensor == sensor.uid, Measurement.session == session.id,
                Measurement.measured_at == sensor.measured_at, Measurement.quality_eligible.is_(True)
            ).limit(1)) is not None for sensor in strongest
        )
        if not confirmed:
            if changes:
                state.deferred_alert = changes[-1]
            return
    if state.deferred_alert:
        changes = changes or [state.deferred_alert]
        state.deferred_alert = None
    previous = state.condition
    state.condition = condition
    if previous is None or previous == condition or not changes:
        return
    state.sequence += 1
    # Link the strongest newly confirmed condition, or the episode whose
    # clearance caused a recovery/de-escalation.
    changed = [db.get(Alert, ident) for ident in changes]
    evidence = max(changed, key=lambda alert: (alert.cleared_at is None and alert.severity == condition,
                                               alert.severity == 'critical', alert.id))
    event = Notification(kind='water_quality', station=station.code, at=at, sequence=state.sequence,
                         detail={'previous': previous, 'condition': condition, 'source': session.source,
                                 'is_simulated': True, 'alert_id': evidence.id})
    audience = select(User.username).where(User.is_active.is_(True),
                                           User.username.in_(select(NotificationInbox.username)))
    publish(db, event, audience)


def notification_routes(app, service, current):
    from .service import Problem

    def response(user, events, more=False):
        items = [dict(id=e.id, type=e.kind, at=e.at, station_code=e.station, **e.detail) for e in events]
        return JSONResponse({'account': user.username, 'items': items, 'has_more': more},
                            headers={'Cache-Control': 'private, no-store', 'Vary': 'Cookie'})

    def inbox_query(username):
        return select(Notification).join(NotificationDelivery).where(NotificationDelivery.username == username)

    @app.get('/api/v1/notifications')
    def history(request: Request):
        user = current(request, 'operator')
        with service.DB() as db:
            events = db.scalars(inbox_query(user.username).order_by(Notification.id.desc()).limit(50)).all()
            return response(user, events)

    @app.post('/api/v1/notifications/poll')
    async def poll(request: Request):
        user = current(request, 'operator')
        try:
            body = await request.json()
            request_id = str(UUID(body['request_id']))
        except (AttributeError, KeyError, ValueError, TypeError):
            raise Problem(422, 'validation_error')
        if body.get('account') != user.username:
            raise Problem(403, 'forbidden')
        through = body.get('through_id')
        if through is not None and (type(through) is not int or not 0 <= through < 2**63):
            raise Problem(422, 'validation_error')
        with service.lock, service.DB.begin() as db:
            if db.bind.dialect.name == 'sqlite':
                db.execute(text('BEGIN IMMEDIATE'))
            db.scalar(select(User).where(User.username == user.username).with_for_update())
            if db.get(NotificationInbox, user.username) is None:
                db.add(NotificationInbox(username=user.username))
            query = inbox_query(user.username).order_by(Notification.id)
            if through is not None:
                query = query.where(Notification.id <= through)
            events = db.scalars(query.where(NotificationDelivery.claim == request_id)).all()
            if not events:
                events = db.scalars(query.where(NotificationDelivery.claim.is_(None)).limit(50)).all()
                for event in events:
                    db.get(NotificationDelivery, (user.username, event.id)).claim = request_id
            remaining = db.scalar(query.with_only_columns(Notification.id, maintain_column_froms=True)
                                  .where(NotificationDelivery.claim.is_(None)).limit(1))
            return response(user, events, remaining is not None)
