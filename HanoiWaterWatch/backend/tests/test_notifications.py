from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
from uuid import uuid4

from sqlalchemy import select

from app.models import Notification, NotificationDelivery
from app.notifications import publish_announcement
from app.schemas import Batch
from app.service import Service, stamp
from test_core import batch, client


HEADERS = {'X-Requested-With': 'hww'}
STATION = 'HWW-KNG-001'


def sign_in(c, name='monitor'):
    c.app.state.service.create_user(name, 'test-password', 'operator')
    assert c.post('/api/v1/auth/login', json={'username': name, 'password': 'test-password'}, headers=HEADERS).status_code == 200


def poll(c, name='monitor', request_id=None):
    return c.post('/api/v1/notifications/poll', json={'account': name, 'request_id': request_id or str(uuid4())}, headers=HEADERS)


def recording(c):
    service = c.app.state.service
    device = service.authenticate('hwwk_test_device_secret')
    start = datetime.now(timezone.utc)

    def send(seq, *, boot='abcdef01', measured=None, delay=0, buffered=False, **values):
        at = start + timedelta(seconds=seq if measured is None else measured)
        packet = batch(seq, at=at)
        packet['boot_id'] = boot
        frame = packet['frames'][0]
        frame['buffered'] = buffered
        frame['readings'] = {
            channel: {'u': service.types[channel]['unit'], 'q': 'ok' if value is not None else 'fault',
                      'v': value, 'gen': 'input', **({'fr': 'disconnected'} if value is None else {})}
            for channel, value in values.items()
        }
        return service.ingest(Batch.model_validate(packet), device, received=at+timedelta(seconds=delay))
    return send


def test_rules_used_for_quality_delivery(client):
    rules = {r['code']: r for r in client.get('/api/v1/rules').json()['items']}
    quality = {code: (r['params'], r['severity'], r['persistence'], r['clear_persistence'])
               for code, r in rules.items() if r['category'] == 'water_quality' and r['enabled']}
    assert quality == {
        'REF_PH_BAND': ({'min': 6, 'max': 9}, 'critical', 3, 3),
        'REF_TEMP_MAX': ({'max': 40}, 'warning', 3, 3),
        'CHG_TURB_SPIKE': ({'multiplier': 3, 'delta': 50}, 'warning', 2, 5),
        'CHG_DO_DROP': ({'ratio': .5, 'delta': 2, 'clear_ratio': .8}, 'warning', 3, 5),
    }
    assert rules['VALID_RANGE']['category'] == rules['STN_OFFLINE']['category'] == 'equipment'


def test_ordered_quality_changes_clear_and_recurrence(client):
    sign_in(client)
    assert poll(client).json()['items'] == []
    send = recording(client)
    send(0, ph=6, temp=40)
    for i in range(1, 4): send(i, ph=9, temp=41)
    for i in range(4, 7): send(i, ph=9.1, temp=41)
    for i in range(7, 10): send(i, ph=9, temp=41)
    for i in range(10, 13): send(i, ph=6, temp=40)
    for i in range(13, 16): send(i, ph=5.9, temp=40)
    assert send(15, ph=5.9)['duplicates'] == 1
    rid = str(uuid4())
    events = poll(client, request_id=rid).json()['items']
    assert [(e['previous'], e['condition']) for e in events] == [
        ('normal','warning'), ('warning','critical'), ('critical','warning'), ('warning','normal'), ('normal','critical')]
    assert [e['id'] for e in events] == sorted({e['id'] for e in events})
    assert all(e['is_simulated'] and e['station_code'] == STATION and e['source'] == 'simulated_wokwi' for e in events)
    assert poll(client, request_id=rid).json()['items'] == events
    assert not poll(client).json()['items']
    history = client.get('/api/v1/notifications')
    assert history.json()['items'] == list(reversed(events))
    assert 'no-store' in history.headers['cache-control']
    assert history.headers['vary'] == 'Cookie'
    sign_in(client,'other')
    assert not poll(client,'other').json()['items']
    assert not client.get('/api/v1/notifications').json()['items']
    assert poll(client, 'monitor').status_code == 403
    sign_in(client)
    assert not poll(client).json()['items']


def test_silent_initial_abnormal_fault_stale_backfill_and_restart(client):
    assert client.get('/api/v1/notifications').status_code == poll(client).status_code == 401
    sign_in(client); poll(client)
    send = recording(client)
    for i in range(3): send(i, ph=5)
    send(3, ph=None)
    send(4, temp=80)
    client.app.state.service.freshness(datetime.now(timezone.utc)+timedelta(seconds=20))
    send(5, ph=7)
    send(6, ph=None)
    send(7, ph=7)
    send(8, ph=7)
    assert not poll(client).json()['items']
    send(9, ph=7)
    assert [e['condition'] for e in poll(client).json()['items']] == ['normal']
    for i in range(10,13): send(i, ph=5, measured=i-15, buffered=True)
    for i in range(13,16): send(i, ph=5, delay=20, buffered=True)
    send(16, ph=5)
    for i in range(17,20): send(i, ph=5, boot='abcdef02')
    assert not poll(client).json()['items']
    for i in range(20,23): send(i, ph=7, boot='abcdef02')
    assert [e['condition'] for e in poll(client).json()['items']] == ['normal']


def test_concurrent_claims_and_paging_addressed_events(client):
    sign_in(client)
    svc = client.app.state.service
    empty_request = {'account': 'monitor', 'request_id': str(uuid4()), 'through_id': 0}
    assert not client.post('/api/v1/notifications/poll', json=empty_request, headers=HEADERS).json()['items']
    with svc.DB.begin() as db:
        for n in range(61):
            publish_announcement(db, recipients=['monitor'], actor='sender', at=stamp(), message=str(n))
    assert not client.post('/api/v1/notifications/poll', json=empty_request, headers=HEADERS).json()['items']
    with ThreadPoolExecutor(max_workers=2) as pool:
        responses = list(pool.map(lambda _: poll(client).json(), range(2)))
    ids = [event['id'] for response in responses for event in response['items']]
    assert len(ids) == len(set(ids)) == 61
    assert sorted(len(response['items']) for response in responses) == [11, 50]
    for response in responses:
        items = response['items']
        assert [e['id'] for e in items] == sorted(e['id'] for e in items)
        assert all(e['type'] == 'announcement' and e['actor'] == 'sender' for e in items)
    assert not poll(client).json()['items']
    with svc.DB() as db:
        assert db.scalar(select(Notification).where(Notification.kind == 'water_quality')) is None
        assert db.scalar(select(NotificationDelivery).where(NotificationDelivery.claim.is_(None))) is None


def test_buffered_and_stale_samples_never_advance_live_persistence(client):
    sign_in(client); poll(client)
    send = recording(client)
    send(0, ph=7)
    send(1, ph=5, buffered=True)
    send(2, ph=5, delay=17)
    send(3, ph=5)
    send(4, ph=5)
    assert not poll(client).json()['items']
    send(5, ph=5)
    assert [e['condition'] for e in poll(client).json()['items']] == ['critical']
    for n in range(6, 10): send(n, ph=7, buffered=True)
    send(10, ph=7)
    send(11, ph=7)
    assert not poll(client).json()['items']
    send(12, ph=7)
    assert [e['condition'] for e in poll(client).json()['items']] == ['normal']
    # No monitor sweep occurs during the gap. A returned stream establishes
    # its initial abnormal class silently under a fresh monitoring session.
    for n in range(100, 103): send(n, ph=5)
    assert not poll(client).json()['items']


def test_deescalation_waits_for_fresh_evidence_on_remaining_rule(client):
    sign_in(client); poll(client)
    send = recording(client)
    send(0, ph=7, temp=20)
    for i in range(1, 4): send(i, ph=7, temp=41)
    for i in range(4, 7): send(i, ph=5)
    assert [e['condition'] for e in poll(client).json()['items']] == ['warning', 'critical']
    for i in range(20, 23): send(i, ph=7)
    assert not poll(client).json()['items']
    send(23, temp=41)
    assert [e['condition'] for e in poll(client).json()['items']] == ['warning']


def test_concurrent_workers_cannot_duplicate_a_confirmed_transition(client):
    service = client.app.state.service
    second = Service(str(service.engine.url), testing=True)
    sign_in(client); poll(client)
    start = datetime.now(timezone.utc)
    device = service.authenticate('hwwk_test_device_secret')
    try:
        for seq, value in enumerate([7, 5, 5]):
            at = start + timedelta(seconds=seq)
            service.ingest(Batch.model_validate(batch(seq, value, at)), device, received=at)
        at = start + timedelta(seconds=3)
        final = Batch.model_validate(batch(3, 5, at))
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(lambda svc: svc.ingest(final, device, received=at), [service, second]))
        assert sorted(result['accepted'] for result in results) == [0, 1]
        assert [e['condition'] for e in poll(client).json()['items']] == ['critical']
    finally:
        second.engine.dispose()
