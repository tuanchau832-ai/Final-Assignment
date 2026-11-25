import kng from '../../../shared/registry/HWW-KNG-001.json';
import tlh from '../../../shared/registry/HWW-TLH-001.json';
import nhu from '../../../shared/registry/HWW-NHU-001.json';
import catalog from '../../../shared/registry/sensor_types.json';
import type { Alert, History, Sensor, Snapshot, Station, Status } from '../types';

export const channels = ['ph','do','turbidity','temp'] as const;
type Channel = typeof channels[number];
const frame = 2000, hour = 3600000, day = 24 * hour;
export const stamp = (time: number) => new Date(time).toISOString();
export const types = catalog.types;

function station(registry: Pick<typeof tlh,'station'|'sensors'>, extras?: { code: string; name: Station['name']; location: Station['location'] }): Station {
  const site = { ...registry.station, ...extras };
  const sensors = registry.sensors.map(original => {
    const type = types[original.channel as Channel];
    return { ...original, ...type, uid: site.code + ':' + original.channel,
      value: null, measured_at: null, status: 'unavailable' as const,
      last_valid: null, fault_reason: null, active_alert_id: null };
  });
  return { ...site, sensors };
}

export const demoStations: Station[] = [
  station(kng), station(tlh), station(nhu),
  station(tlh, { code:'HWW-DEMO-04', name:{en:'Tô Lịch, demonstration station 2',vi:'Sông Tô Lịch, trạm minh họa 2'}, location:{lat:20.998,lng:105.824} }),
  station(kng, { code:'HWW-DEMO-05', name:{en:'Kim Ngưu, demonstration station 2',vi:'Sông Kim Ngưu, trạm minh họa 2'}, location:{lat:21.009,lng:105.861} }),
];
const states: Record<string, Status> = {
  'HWW-KNG-001':'normal', 'HWW-TLH-001':'abnormal', 'HWW-NHU-001':'unavailable', 'HWW-DEMO-04':'degraded', 'HWW-DEMO-05':'offline',
};

export function createDataset(now: number) {
  const anchor = Math.floor(now / frame) * frame;
  const activeSince = anchor - 7 * 60000;
  function lastFrame(code: string) {
    return states[code] === 'unavailable' ? null : states[code] === 'offline' ? anchor - 3 * hour : anchor;
  }
  function sample(code: string, channel: Channel, time: number): number | null {
    const last = lastFrame(code);
    if (last == null || time > last || time < anchor - 30 * day) return null;
    if (code === 'HWW-TLH-001' && channel === 'ph' && time >= activeSince) return 9.7;
    if (code === 'HWW-DEMO-04' && channel === 'turbidity' && time >= activeSince) return 108;
    if (code === 'HWW-KNG-001' && channel === 'turbidity' && time >= anchor - 5 * hour && time < anchor - 5 * hour + 300000) return 105;
    const base = {ph:7.18,do:7.0,turbidity:20,temp:24.5}[channel];
    const variation = {ph:.24,do:.8,turbidity:5,temp:2.2}[channel];
    const phase = (time - anchor) / hour + demoStations.findIndex(site => site.code === code);
    return Number((base + variation * (.66 * Math.sin(phase * .63) + .34 * Math.cos(phase * 2))).toFixed(types[channel].decimals));
  }
  function alert(id: number, code: string, channel: Channel | null, rule: string, en: string, vi: string, severity: string, at: number, cleared: number | null, reference?: number): Alert {
    return { id, rule_code:rule, rule_name:{en,vi}, station_code:code, sensor_uid:channel ? code + ':' + channel : null,
      category:channel ? 'water_quality' : 'equipment', severity, evidence_class:'simulated_anomaly', is_preliminary:true,
      review_status:cleared ? 'closed' : 'open', opened_at:stamp(at), cleared_at:cleared === null ? null : stamp(cleared),
      observed_value:channel ? sample(code,channel,at) : null, unit:channel ? types[channel].unit : '',
      threshold_value:reference, baseline_value:channel ? sample(code,channel,at-300000) : null,
      basis_snapshot:{basis_text:{en:'Synthetic example using the existing rule catalogue.',vi:'Ví dụ tổng hợp dựa trên danh mục quy tắc hiện có.'},basis_status:'not_applicable'},
      events:[{type:'alert_opened',at:stamp(at)}, ...(cleared ? [
        {type:'review_started',at:stamp(cleared-120000),actor:'Demo reviewer'},
        {type:'review_submitted',at:stamp(cleared),actor:'Demo reviewer',data:{note:'Reviewed the synthetic turbidity episode.'}},
        {type:'alert_closed',at:stamp(cleared)},
      ] : [])],
      review:cleared ? {id:5000 + id,status:'submitted',outcome:'confirmed_simulated_anomaly'} : undefined,
    };
  }
  const alerts = [
    alert(1004,'HWW-TLH-001','ph','REF_PH_BAND','pH above the reference band','pH cao hơn khoảng tham chiếu','critical',activeSince,null,9),
    alert(1003,'HWW-DEMO-04','turbidity','CHG_TURB_SPIKE','Turbidity increased','Độ đục tăng','warning',activeSince,null,70),
    alert(1002,'HWW-DEMO-05',null,'STN_OFFLINE','Station stopped reporting','Trạm ngừng gửi dữ liệu','info',anchor-3*hour+15000,null),
    alert(1001,'HWW-KNG-001','turbidity','CHG_TURB_SPIKE','Turbidity episode reviewed','Đã đánh giá đợt tăng độ đục','warning',anchor-5*hour,anchor-5*hour+300000,70),
  ];

  function state(site: Station, version: number): Snapshot {
    const last = lastFrame(site.code);
    const sensors = (site.sensors || []).map((entry): Sensor => {
      const active = alerts.find(a => a.sensor_uid === entry.uid && !a.cleared_at);
      const prior = last === null ? null : sample(site.code,entry.channel as Channel,last);
      const current = states[site.code] === 'offline' ? null : prior;
      return { ...entry, value:current, measured_at:current !== null && last !== null ? stamp(last) : null,
        last_valid:prior !== null && last !== null ? {value:prior,measured_at:stamp(last)} : null,
        status:active ? 'abnormal' : current === null ? states[site.code] : 'normal', active_alert_id:active?.id ?? null };
    });
    return {station_code:site.code, version, generated_at:stamp(anchor), station_status:states[site.code],
      last_frame_at:last === null ? null : stamp(last), session:last === null ? null : {source:'demo_dataset',id:'demo-source-' + site.code},
      sensors, open_alert_count:alerts.filter(a => a.station_code === site.code && a.review_status === 'open').length};
  }

  function history(code: string, channel: Channel, from: number, to: number, requested: string | null): History {
    const span = to-from;
    const bucket = requested && requested !== 'auto' ? requested : span <= 900000 ? 'raw' : span <= hour ? '10s' : span <= 6*hour ? '1m' : span <= day ? '5m' : '1h';
    const widths: Record<string, number> = {raw:frame,'10s':10000,'1m':60000,'5m':300000,'1h':hour};
    const interval = widths[bucket];
    const last = lastFrame(code), points: History['points'] = [];
    if (!interval || last === null) return {points,bucket,...types[channel]};
    const first = Math.ceil(Math.max(from,anchor - 30*day)/interval)*interval;
    for (let t = first; t <= Math.min(to,last) && points.length < 5000; t += interval) {
      const v = sample(code,channel,t);
      points.push({t:stamp(t),v,min:v,max:v,n:v === null ? 0 : 1,faults:0});
    }
    return {points,bucket,...types[channel]};
  }

  function availability(code: string, from: number, to: number) {
    const expected = Math.floor((to-from)/frame), last = lastFrame(code);
    const span = last === null ? 0 : Math.min(to,last) - Math.max(from,anchor - 30*day);
    const received = Math.max(0, Math.floor(span/frame));
    return {expected_frames:expected,received_frames:received,pct:expected ? Math.min(100,100 * received/expected) : null};
  }
  return {alerts, anchor, sample, state, history, availability};
}
