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

  it('keeps lifecycle, historical readings and announcement delivery local to the demo', async () => {
    let user: User | null = {...reviewer, username:'admin', role:'admin'};
    const provider = createDemoProvider(async () => user, epoch);
    const code = 'HWW-TLH-001';
    const history = new URLSearchParams({channel:'ph',from:new Date(epoch - 120000).toISOString(),to:new Date(epoch).toISOString()});
    const historyPath = `/stations/${code}/measurements?${history}`;
    const before = await provider.request(historyPath);
    const change = { lifecycle:'archived', previous:'active', confirmed:true, reason:'Demo archive',
      request_id:'626d99f4-e3e2-4dd3-9634-94d442e00dcd' };
    const path = `/admin/stations/${code}/lifecycle`;
    const archived = await provider.request(path, change);
    expect(archived).toMatchObject({lifecycle:'archived'});
    expect(await provider.request(path, change)).toEqual(archived);
    expect((await provider.request<{items:Station[]}>('/stations')).items.find(site => site.code === code)).toBeUndefined();
    expect(await provider.request(historyPath)).toEqual(before);
    expect(await provider.request(`/admin/statistics?station=${code}&${history}`))
      .toMatchObject({is_simulated:true, items:[{station:code, sources:['demo_dataset']}]});
    expect(await provider.request('/notifications')).toMatchObject({items:[]});
    const send = { audience:'all', message:'Local maintenance notice', confirmed:true,
      request_id:'3775fbd3-b11f-47a4-863f-2ff42124b8d1' };
    const sent = await provider.request('/admin/announcements', send);
    expect(sent).toMatchObject({recipient_count:1});
    expect(await provider.request('/admin/announcements', send)).toEqual(sent);
    const poll = {account:'admin', request_id:'d65f0dfb-0bf8-4330-862c-ab83f917733e'};
    const delivery = await provider.request('/notifications/poll', poll);
    expect(delivery).toMatchObject({items:[{message:send.message, type:'announcement'}]});
    expect(await provider.request('/notifications/poll', poll)).toEqual(delivery);
    expect(await provider.request('/notifications/poll', {...poll, request_id:send.request_id})).toMatchObject({items:[]});
    user = reviewer;
    await expect(provider.request('/admin/stations')).rejects.toMatchObject({status:403});
    await expect(provider.request('/notifications/poll', poll)).rejects.toMatchObject({status:403});
    expect(await provider.request('/notifications')).toMatchObject({items:[]});
    user = null;
    await expect(provider.request('/notifications')).rejects.toMatchObject({status:401});
  });
});
