import { describe, expect, it } from 'vitest';
import { createDemoProvider } from './provider';
import type { Alert, History, Snapshot, Station, User } from '../types';

const epoch = Date.parse('2026-11-25T02:00:00Z');
const reviewer: User = { username:'tester', display_name:'Reviewer', role:'reviewer' };
const demo = (user:User | null = null) => createDemoProvider(async () => user, epoch);

describe('isolated demo provider', () => {
  it('keeps alerts, station snapshots and historical samples consistent across runs', async () => {
    const provider = demo(), stations = await provider.request<{items:Station[]}>('/stations');
    expect(stations.items.length).toBeGreaterThan(3);
    expect(await demo().request('/stations')).toEqual(stations);
    const alerts = await provider.request<{items:Alert[]}>('/alerts?severity=critical&active=true');
    const alert = alerts.items[0], code = alert.station_code;
    const state = await provider.request<Snapshot>('/stations/' + code + '/state');
    expect(state.sensors.find(sensor => sensor.channel === 'ph')?.value).toBe(alert.observed_value);
    const range = new URLSearchParams({channel:'ph',from:new Date(epoch - 120000).toISOString(),to:new Date(epoch).toISOString()});
    const history = await provider.request<History>(`/stations/${code}/measurements?${range}`);
    expect(history.points.at(-1)?.v).toBe(alert.observed_value);
  });

  it('requires staff roles and isolates replay outputs from monitoring state', async () => {
    const path = '/replays/demo-golden/runs', body = { station_code:'HWW-KNG-001', speed:1 };
    await expect(demo().request(path, body)).rejects.toMatchObject({status:401});
    await expect(demo({...reviewer,role:'operator'}).request('/incident-reviews',{alert_ids:[1001]})).rejects.toMatchObject({status:403});
    const provider = demo(reviewer), state = '/stations/HWW-KNG-001/state';
    const before = await provider.request(state);
    const run = await provider.request<{session_id:string}>(path, body);
    const output = await provider.request<{last_batch:unknown;session:{id:string}}>('/stations/HWW-KNG-001/link');
    expect(output.session.id).toBe(run.session_id);
    expect(output.last_batch).toBeTruthy();
    expect(await provider.request(state)).toEqual(before);
    await provider.request(`/replay-runs/${run.session_id}/stop`, {});
    expect(await provider.request(state)).toEqual(before);
  });
});
