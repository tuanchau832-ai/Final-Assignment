import { ApiError, type DataProvider } from '../dataProvider';
import { visibleAlertEvents } from '../domain';
import type { Alert, User } from '../types';
import { channels, createDataset, demoStations, stamp } from './dataset';

const recordings = [
  { name:'demo-golden', duration_s:90 },
  { name:'turbidity-spike', duration_s:65 },
  { name:'gradual-ph', duration_s:75 },
];
const roleRank: Record<string,number> = {operator:0,reviewer:1,admin:2};
const reviewOutcomes = ['confirmed_simulated_anomaly','sensor_or_equipment_fault','false_positive','test_or_calibration'];
type DemoRun = { id:string; station:string; recording:string; start:number; end:number; stopped?:number; owner:string; };
const error = (status: number, message: string): never => { throw new ApiError(status,message); };

function page<T>(items: T[], query: URLSearchParams) {
  const limit = Math.max(1, Math.min(100, Number(query.get('limit')) || 50));
  const offset = Math.max(0, Number(query.get('cursor')) || 0);
  return { items:items.slice(offset,offset+limit), total:items.length,
    next_cursor:offset+limit < items.length ? String(offset+limit) : null, is_simulated:true };
}
function dateRange(query: URLSearchParams, anchor: number) {
  const to = query.has('to') ? Date.parse(query.get('to')!) : anchor;
  const from = query.has('from') ? Date.parse(query.get('from')!) : to - 3600000;
  if (!Number.isFinite(to-from) || to <= from || to-from > 30*86400000) return error(422,'Invalid demo history range');
  return {from,to};
}

export function createDemoProvider(authorize: () => Promise<User | null>, now = Date.now()): DataProvider {
  const dataset = createDataset(now);
  const { alerts, anchor } = dataset;
  const runs = new Map<string, DemoRun>(), reviewOwners = new Map<number,string>();
  let version = 1, nextReview = 7000, nextRun = 1;
  async function staff(required: 'operator' | 'reviewer') {
    const user = await authorize();
    if (!user) return error(401,'Sign in to use this demo action.');
    if (!(roleRank[user.role] >= roleRank[required])) return error(403,'Your role does not permit this demo action.');
    return user;
  }
  function detail(alert: Alert, user: User | null) {
    return {...alert, events:visibleAlertEvents(alert.events,!!user)};
  }
  function event(alert: Alert, user: User, type: string, note?: string) {
    alert.events = [...(alert.events || []),{type,at:stamp(Date.now()),actor:user.display_name,data:note ? {note} : undefined}];
    version++;
  }
  function getAlert(id: string) {
    return alerts.find(alert => String(alert.id) === id) ?? error(404,'Demo alert not found');
  }
  async function mutate(parts: string[], payload: unknown) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return error(422,'Expected a demo action payload');
    const data = payload as Record<string,unknown>;
    const [resource,id,action] = parts;
    if (resource === 'alerts' && ['acknowledge','notes'].includes(action)) {
      const user = await staff('operator'), alert = getAlert(id);
      if (action === 'acknowledge') {
        if (alert.review_status !== 'open') return error(409,'This demo alert has already been acknowledged.');
        alert.review_status = 'acknowledged';
      } else if (typeof data.text !== 'string' || !data.text.trim()) return error(422,'Enter a demo note.');
      const note = action === 'notes' ? data.text : data.note;
      event(alert,user,action === 'notes' ? 'note' : 'acknowledged',typeof note === 'string' ? note.slice(0,2000) : undefined);
      return detail(alert,user);
    }
    if (resource === 'incident-reviews') {
      const user = await staff('reviewer');
      if (!id) {
        if (!Array.isArray(data.alert_ids) || data.alert_ids.length !== 1) return error(422,'Select one demo alert to review.');
        const alert = getAlert(String(data.alert_ids[0]));
        if (!['open','acknowledged'].includes(alert.review_status)) return error(409,'This alert cannot start another review.');
        const review = {id:nextReview++,status:'in_progress'};
        reviewOwners.set(review.id,user.username);
        alert.review = review;
        alert.review_status = 'under_review';
        event(alert,user,'review_started',typeof data.note === 'string' ? data.note : undefined);
        return review;
      }
      if (action !== 'submit' || !reviewOutcomes.includes(String(data.outcome)) || typeof data.note !== 'string' || !data.note.trim()) return error(422,'Enter a valid review outcome and note.');
      const alert = alerts.find(item => item.review?.id === Number(id));
      if (alert?.review?.status !== 'in_progress') return error(409,'The demo review is not open.');
      if (user.role !== 'admin' && reviewOwners.get(alert.review.id) !== user.username) return error(403,'Only the assigned reviewer may submit this review.');
      alert.review = {...alert.review, status:'submitted', outcome:String(data.outcome)};
      alert.review_status = 'closed';
      event(alert,user,'review_submitted',data.note.slice(0,2000));
      event(alert,user,'alert_closed');
      return alert.review;
    }
    if (resource === 'replays' && action === 'runs') {
      const user = await staff('operator');
      const recording = recordings.find(item => item.name === id);
      const site = demoStations.find(station => station.code === data.station_code && station.data_mode !== 'planned');
      const speed = Number(data.speed);
      if (!site || !recording || ![1,2,5].includes(speed)) return error(422,'Select an available station, replay and speed.');
      const previous = runs.get(site.code);
      if (previous && !previous.stopped && previous.end > Date.now() && data.takeover !== true) return error(409,'A demo replay is already running.');
      const start = Date.now();
      const run = {id:'demo-run-' + nextRun++,station:site.code,recording:id,start,end:start + recording.duration_s*1000/speed,owner:user.username};
      runs.set(site.code,run);
      return {session_id:run.id,station_code:run.station,started_at:stamp(run.start),expected_end_at:stamp(run.end), is_simulated:true};
    }
    if (resource === 'replay-runs' && action === 'stop') {
      const user = await staff('operator');
      const run = [...runs.values()].find(item => item.id === id);
      if (!run) return error(404,'Demo replay not found.');
      if (user.role !== 'admin' && run.owner !== user.username) return error(403,'Only the replay owner may stop it.');
      run.stopped = Date.now();
      return {session_id:run.id,is_simulated:true};
    }
    return error(404,'Unsupported demonstration action');
  }

  function link(code: string) {
    const run = runs.get(code);
    const active = !!run && !run.stopped && run.end > Date.now();
    const site = demoStations.find(station => station.code === code)!;
    const baseline = Object.fromEntries(dataset.state(site,version).sensors.map(sensor => [sensor.channel, sensor.value ?? sensor.last_valid?.value ?? null]));
    const measurements = Object.fromEntries(channels.map(channel => {
      const value = baseline[channel];
      return [channel,channel === 'turbidity' && run?.recording === 'turbidity-spike' ? 180 :
        channel === 'ph' && run?.recording === 'gradual-ph' ? 9.7 : value];
    }));
    return { station_code:code, link_status:active ? 'replay' : run ? 'offline' : 'waiting',
      last_frame_received_at:run ? stamp(run.start) : null, diag:null, last_error:null, is_simulated:true,
      session:run ? {id:run.id,station_code:code,ended_at:active ? null : stamp(run.stopped || run.end),
        source:'simulated_replay',device_code:'demo-replay',boot_id:run.id,fw_version:'demo-1',
        frames_accepted:1,frames_duplicate:0,frames_rejected:0} : null,
      last_batch:run ? {schema:'demo.simulation.v1',station_code:code,scenario:run.recording,source:'demo_simulation',
        observed:false,baseline,frames:[{sequence:1,simulated_at:stamp(run.start),measurements}]} : null };
  }
  async function read(parts: string[], query: URLSearchParams) {
    const [resource,id,scope] = parts;
    if (resource === 'health') return {status:'ok',db:'demo',ingest_enabled:false,is_simulated:true};
    if (resource === 'meta') return {wokwi_project_url:null,server_time:stamp(anchor),is_simulated:true};
    if (resource === 'replays' && !id) { await staff('operator'); return {items:recordings,is_simulated:true}; }
    if (resource === 'stations') {
      if (!id) return {items:demoStations,is_simulated:true};
      const site = demoStations.find(station => station.code === id) ?? error(404,'Demo station not found');
      if (!scope) return site;
      if (scope === 'state') return dataset.state(site,version);
      if (scope === 'link') return link(id);
      const {from,to} = dateRange(query,anchor);
      if (scope === 'measurements') {
        const channel = channels.find(value => value === query.get('channel'));
        if (!channel) return error(422,'Unsupported demo sensor.');
        return dataset.history(id,channel,from,to,query.get('bucket'));
      }
      if (scope === 'timeline') {
        const items = alerts.filter(alert => alert.station_code === id && Date.parse(alert.opened_at) >= from && Date.parse(alert.opened_at) <= to)
          .map(alert => ({at:alert.opened_at,type:'alert_opened',sensor_uid:alert.sensor_uid,data:{alert_id:alert.id}}));
        return {...page(items,query),availability:dataset.availability(id,from,to)};
      }
    }
    if (resource === 'alerts') {
      if (id) {
        const user = await authorize().catch(() => null);
        return detail(getAlert(id),user);
      }
      const filters = {station:'station_code',severity:'severity',category:'category',evidence_class:'evidence_class',rule:'rule_code'} as const;
      const items = alerts.filter(item =>
        Object.entries(filters).every(([filter,key]) => !query.has(filter) || query.get(filter) === item[key]) &&
        (!query.has('review_status') || query.get('review_status')!.split(',').includes(item.review_status)) &&
        (!query.has('channel') || item.sensor_uid?.endsWith(':' + query.get('channel'))) &&
        (!query.has('active') || (query.get('active') === 'true') === !item.cleared_at) &&
        (!query.has('from') || Date.parse(item.opened_at) >= Date.parse(query.get('from')!)) &&
        (!query.has('to') || Date.parse(item.opened_at) <= Date.parse(query.get('to')!)));
      return page(items.map(item => detail(item,null)),query);
    }
    return error(404,'Unsupported demonstration resource');
  }
  return {
    async request<T>(path: string, body?: unknown) {
      const [route, query] = path.split('?',2);
      const parts = route.split('/').filter(Boolean).map(decodeURIComponent);
      return structuredClone(body === undefined ? await read(parts,new URLSearchParams(query)) : await mutate(parts,body)) as T;
    },
  };
}
