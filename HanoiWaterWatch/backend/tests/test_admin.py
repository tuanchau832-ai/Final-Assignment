from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
import pytest
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError

from app.models import AdminAudit, Notification, User
from app.service import stamp
from test_core import batch, client, ingest, state

API = '/api/v1'
HEADERS = {'X-Requested-With': 'hww'}
KNG = 'HWW-KNG-001'
NEW = 'HWW-ABC-077'


def post(client, route, body):
    return client.post(API + route, json=body, headers=HEADERS)


def login(client, role, name=None):
    name = name or role
    client.app.state.service.create_user(name, 'local-admin-test-pass', role)
    assert post(client, '/auth/login', {'username': name, 'password': 'local-admin-test-pass'}).status_code == 200


def command(**values):
    return {'request_id': str(uuid4()), 'confirmed': True, **values}


def change(client, station, previous, lifecycle):
    return post(client, '/admin/stations/' + station + '/lifecycle',
                command(previous=previous, lifecycle=lifecycle, reason='Scheduled service'))


def endpoints(client):
    return [client.get(API + '/admin/' + path) for path in ('stations', 'audit', 'statistics')] + [
        post(client, path, {}) for path in ('/admin/stations', '/admin/announcements', '/admin/stations/' + KNG + '/lifecycle')]


def test_authorization_every_admin_route(client):
    assert {r.status_code for r in endpoints(client)} == {401}
    for role in ('operator', 'reviewer'):
        login(client, role)
        assert {r.status_code for r in endpoints(client)} == {403}
    login(client, 'admin')
    for path in ['/admin/stations', '/admin/audit', '/admin/statistics?station=' + KNG]:
        response = client.get(API + path)
        assert response.status_code == 200 and 'no-store' in response.headers['Cache-Control']
    with client.app.state.service.DB.begin() as db:
        db.get(User, 'admin').role = 'reviewer'
    assert {r.status_code for r in endpoints(client)} == {403}
    client.cookies.clear()
    expired = jwt.encode({'sub': 'admin', 'exp': 1, 'jti': 'expired'}, 'test-only-secret-32-characters-long', algorithm='HS256')
    client.cookies.set('hww_session', expired)
    assert {r.status_code for r in endpoints(client)} == {401}


def test_create_validate_retry_and_archive(client):
    login(client, 'admin')
    create = command(code=NEW, name_en='River monitor', name_vi='Trạm sông', river='Nhuệ',
                     lat=21.1, lng=105.7, data_mode='replay', reason='New station')
    for invalid in [{'lat': 91}, {'lng': '12'}, {'name_vi': '  '}, {'code': '../station'},
                    {'data_mode': 'field'}, {'confirmed': False}, {'reason': ''}]:
        assert post(client, '/admin/stations', {**create, **invalid}).status_code == 422
    def create_once():
        return post(client, '/admin/stations', create).status_code
    with ThreadPoolExecutor(2) as pool:
        assert list(pool.map(lambda _: create_once(), range(2))) == [201, 201]
    assert post(client, '/admin/stations', {**create, 'request_id': str(uuid4())}).status_code == 409
    meta = client.get(API + '/stations/' + NEW).json()
    assert meta['lifecycle'] == 'active' and all(s['uid'].startswith(NEW + ':') for s in meta['sensors'])
    assert post(client, '/replays/tlh-loop/runs', {'station_code': NEW, 'loop': True}).status_code == 202
    assert change(client, NEW, 'active', 'maintenance').status_code == 200
    runs = client.get(API + '/sessions?station=' + NEW).json()['items']
    assert runs and all(r['ended_at'] and r['end_reason'] == 'maintenance' for r in runs)
    assert post(client, '/replays/tlh-loop/runs', {'station_code': NEW}).status_code == 409
    pause = next(s for s in client.get(API + '/stations').json()['items'] if s['code'] == NEW)
    assert pause['lifecycle'] == 'maintenance'
    archive = command(previous='maintenance', lifecycle='archived', reason='Retired')
    def archive_once():
        return post(client, '/admin/stations/' + NEW + '/lifecycle', archive).status_code
    with ThreadPoolExecutor(2) as pool:
        assert list(pool.map(lambda _: archive_once(), range(2))) == [200, 200]
    client.app.state.service.seed()
    assert all(s['code'] != NEW for s in client.get(API + '/stations').json()['items'])
    assert client.get(API + '/stations/' + NEW).json()['lifecycle'] == 'archived'
    assert change(client, NEW, 'archived', 'active').status_code == 409
    history = client.get(API + '/stations/' + NEW + '/measurements?channel=ph').json()
    assert history['points']
    assert [a['after'] for a in client.get(API + '/admin/audit').json()['items']] == ['archived', 'maintenance', 'active']


def test_hold_blocks_freshness_ingest_and_resets_baseline(client):
    login(client, 'admin')
    poll = lambda: post(client, '/notifications/poll', {'account': 'admin', 'request_id': str(uuid4())}).json()['items']
    assert poll() == []
    early = datetime.now(timezone.utc) - timedelta(seconds=5)
    for i, value in enumerate((7, 5, 5, 5)):
        assert ingest(client, batch(i, value, early + timedelta(seconds=i))).status_code == 200
    assert len(poll()) == 1
    assert change(client, KNG, 'active', 'maintenance').status_code == 200
    assert ingest(client, batch(4)).status_code == 409
    client.app.state.service.freshness(datetime.now(timezone.utc) + timedelta(days=1))
    snap = state(client)
    assert snap['station_status'] == 'unavailable' and snap['sensors'][0]['value'] is None
    assert snap['sensors'][0]['last_valid']['value'] == 5 and not poll()
    assert change(client, KNG, 'maintenance', 'active').status_code == 200
    assert ingest(client, batch(5, 7, early)).json()['accepted'] == 0
    after = datetime.now(timezone.utc)
    for i, value in enumerate((7, 5, 5, 5)):
        assert ingest(client, batch(10 + i, value, after + timedelta(milliseconds=i))).status_code == 200
        if i < 3:
            assert not poll()
    events = poll()
    assert len(events) == 1 and events[0]['condition'] == 'critical'
    assert change(client, KNG, 'active', 'archived').status_code == 200
    client.app.state.service.seed()
    assert client.get(API + '/stations/' + KNG).json()['lifecycle'] == 'archived'
    assert len(client.get(API + '/alerts?station=' + KNG).json()['items']) == 2


def test_measurement_statistics_and_missing_denominators(client):
    login(client, 'admin')
    start = datetime.now(timezone.utc) - timedelta(minutes=3)
    for i, value in enumerate([7, 8, 5, 5, 5]):
        ingest(client, batch(i, value, start + timedelta(seconds=2 * i)))
    ingest(client, batch(5, None, start + timedelta(seconds=10), q='fault', fr='injected'))
    route = '/admin/statistics'
    query = {'station': KNG, 'compare': 'HWW-NHU-001', 'channel': 'ph', 'from': stamp(start), 'to': stamp(start + timedelta(minutes=1))}
    result = client.get(API + route, params=query).json()
    actual, empty = result['items']
    assert result['unit'] == 'pH' and actual['samples'] == 6 and actual['valid'] == 5
    assert (actual['minimum'], actual['mean'], actual['maximum']) == (5, 6, 8)
    assert (actual['first_value'], actual['last_value'], actual['episodes']) == (7, 5, 1)
    assert (actual['received_frames'], actual['expected_frames'], actual['coverage_pct']) == (6, 30, 20)
    assert actual['sources'] == ['simulated_wokwi'] and empty['coverage_pct'] is None and empty['mean'] is None
    assert change(client, KNG, 'active', 'maintenance').status_code == 200
    later = datetime.now(timezone.utc) + timedelta(seconds=1)
    row = client.get(API + route, params={**query, 'from': stamp(later), 'to': stamp(later + timedelta(minutes=1))}).json()['items'][0]
    assert row['maintenance_seconds'] == 60 and row['expected_frames'] == 0 and row['coverage_pct'] is None
    assert client.get(API + route, params={**query, 'channel': 'fake'}).status_code == 422
    assert client.get(API + route, params={**query, 'to': stamp(start + timedelta(days=8))}).status_code == 422


def test_addressed_announcement_failure_empty_and_retries(client, monkeypatch):
    from app import notifications
    login(client, 'admin')
    request = command(audience='operator', message='Intake maintenance at noon')
    assert post(client, '/admin/announcements', request).json()['outcome'] == 'empty'
    service = client.app.state.service
    service.create_user('eligible', 'local-admin-test-pass', 'operator')
    service.create_user('disabled', 'local-admin-test-pass', 'operator')
    with service.DB.begin() as db:
        db.get(User, 'disabled').is_active = False
    send = {**request, 'request_id': str(uuid4())}
    def fail(db, **arguments):
        db.add(Notification(kind='announcement', at=stamp(), detail={}))
        db.flush()
        raise SQLAlchemyError('Injected delivery failure')
    with monkeypatch.context() as m:
        m.setattr(notifications, 'publish_announcement', fail)
        assert post(client, '/admin/announcements', send).status_code == 503
    with service.DB() as db:
        assert db.scalar(select(func.count()).select_from(AdminAudit)) == 1
        assert db.scalar(select(func.count()).select_from(Notification)) == 0
    with ThreadPoolExecutor(2) as pool:
        outcomes = list(pool.map(lambda _: post(client, '/admin/announcements', send).json(), range(2)))
    assert outcomes[0] == outcomes[1] and outcomes[0]['recipient_count'] == 1
    assert post(client, '/admin/announcements', {**send, 'message': 'different'}).status_code == 409
    for invalid in [{'audience': 'stranger'}, {'message': '  '}, {'confirmed': False}, {'message': 'x' * 1601}]:
        assert post(client, '/admin/announcements', {**send, **invalid}).status_code == 422
    assert client.get(API + '/notifications?account=eligible').json()['items'] == []
    login(client, 'operator', 'eligible')
    item, = client.get(API + '/notifications').json()['items']
    assert item['type'] == 'announcement' and item['message'] == send['message'] and item['actor'] == 'admin'
    assert not client.get(API + '/alerts').json()['items']
