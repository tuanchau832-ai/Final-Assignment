import StationLifecycle from './StationLifecycle';
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Brush, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Box, Download, MapPin } from 'lucide-react';
import { useAlerts, useHistory, useOnline, useResource, useStation, useStationState } from './api';
import { Empty, QueryState, SensorCard, Source, StatusBadge, useText } from './common';
import { useClock } from './clock';
import { formatShortTime, formatTime, formatValue, historyCsv, mergeHistoryTail, rollingWindow, withGaps } from './domain';
import { demoMode } from './features';
import { useNetworkStations } from './useNetworkStations';
import { useReducedMotion } from './useMotion';
import type { Sensor } from './types';
import sensorTypes from '../../shared/registry/sensor_types.json';
import './dashboard.css';

const ranges = [['0.25','minutes15'],['1','hour1'],['6','hours6'],['24','hours24'],['168','days7']] as const;
const availableRanges = demoMode ? [...ranges, ['720','days30'] as const] : ranges;
const intervals: Record<string, number> = { raw:2000, '10s':10000, '1m':60000, '5m':300000, '1h':3600000 };
type Window = { from: string; to: string };
type Timeline = {
  availability: { pct: number | null };
  items: { at: string; type: string; sensor_uid: string | null; data: Record<string, unknown> }[];
};

function dateWindow(start: string, end: string): Window | undefined {
  if (!start || !end) return;
  const from = Date.parse(start + '+07:00'), to = Date.parse(end + '+07:00');
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from || to - from > (demoMode ? 30 : 7) * 86400000) return;
  return { from: new Date(from).toISOString(), to: new Date(to).toISOString() };
}

function Value({ value, decimals = 0, suffix = '' }: { value: number | null | undefined; decimals?: number; suffix?: string }) {
  const { i18n } = useTranslation(), reduced = useReducedMotion();
  const [animated, setAnimated] = useState<number | null>(null), previous = useRef<number | null>(null);
  useEffect(() => {
    if (value == null || reduced) {
      previous.current = value ?? null;
      setAnimated(value ?? null);
      return;
    }
    const start = performance.now(), before = previous.current ?? 0;
    let frame: number;
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / 540);
      previous.current = before + (value - before) * (1 - (1 - progress) ** 3);
      setAnimated(previous.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);
  return <strong aria-label={formatValue(value, decimals, i18n.language) + (value == null ? '' : suffix)}>
    {formatValue(value == null ? null : animated, decimals, i18n.language)}{value == null || animated == null ? '' : suffix}
  </strong>;
}

export default function DashboardPage() {
  const { code = 'HWW-KNG-001' } = useParams(), { t, i18n } = useTranslation(), text = useText(), navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const latestFilters = useRef(params);
  useLayoutEffect(() => { latestFilters.current = params; }, [params]);
  const { registry, stations, snapshotQueries } = useNetworkStations();
  const station = useStation(code), q = useStationState(code), online = useOnline();
  const now = useClock(), range = params.get('range') || '1', channel = params.get('sensor') || '';
  const river = params.get('river') || '', compare = params.get('compare') || '', severity = params.get('severity') || '';
  const custom = params.get('from') || '', customEnd = params.get('to') || '';
  const periodClock = Math.floor(now / 10000) * 10000;
  const window = useMemo(() => range === 'custom' ? dateWindow(custom, customEnd) : rollingWindow(periodClock, Number(availableRanges.find(r => r[0] === range)?.[0] || 1)), [range, custom, customEnd, periodClock]);
  const disconnected = !online || q.isError;
  const filtered = stations.filter(s => !river || s.river === river);
  const comparison = stations.find(s => s.code === compare && s.code !== code)?.code;
  const sensorCatalog = sensorTypes.types as Record<string, { label: { en: string; vi: string } }>;
  const sensors = q.data?.sensors.filter(sensor => !channel || sensor.channel === channel) || [];
  const period = new URLSearchParams(window || {});
  const timeline = useResource<Timeline>('timeline', `/stations/${code}/timeline?${period}&limit=30`, 10000, !!window);
  const warning = useAlerts(`station=${code}&active=true&severity=warning&limit=1`);
  const critical = useAlerts(`station=${code}&active=true&severity=critical&limit=1`);
  const alertFilters = new URLSearchParams(period);
  alertFilters.set('station', code);
  if (channel) alertFilters.set('channel', channel);
  if (severity) alertFilters.set('severity', severity);
  const periodAlerts = useResource<{total:number;items:Array<{id:number;opened_at:string}>}>('dashboard-alerts',
    `/alerts?${alertFilters}&limit=12`, 10000, !!window);
  function updateFilter(key: string, value: string) {
    // A second input can change before the router renders the first navigation.
    const next = new URLSearchParams(latestFilters.current);
    if (value) next.set(key, value); else next.delete(key);
    latestFilters.current = next;
    return next;
  }
  function filter(key: string, value: string) {
    setParams(updateFilter(key, value));
  }
  function selectRiver(value: string) {
    const next = updateFilter('river', value);
    const first = stations.find(s => s.river === value);
    if (value && first && station.data?.river !== value) navigate(`/stations/${first.code}/dashboard?${next}`);
    else setParams(next);
  }
  const statuses = snapshotQueries.map(query => query.isSuccess ? query.data.station_status : undefined);
  const complete = online && registry.isSuccess && statuses.every(Boolean);
  const reporting = complete ? statuses.filter(status => status !== 'offline' && status !== 'unavailable').length : null;
  const offline = complete ? statuses.filter(status => status === 'offline').length : null;
  const timestamp = disconnected ? null : q.data?.last_frame_at;
  return <div className="water-dashboard">
    <div className="page-title"><div><div className="eyebrow">{t('dashboard')} / {code}</div>
      <h1>{station.data ? text(station.data.name) : code}</h1><p>{t('oneSnapshot')}</p></div>
      <div className="context-links"><Link className="textlink" to={'/map?station=' + code}><MapPin size={16}/>{t('viewMap')}</Link>
        <Link className="textlink" to={`/stations/${code}/model?${params}`}><Box size={16}/>{t('model')}</Link></div>
    </div>
    <div className="dashboard-network" aria-label={t('networkSummary')}>
      <Link to="/overview">{t('networkSummary')}</Link>
      <span><Value value={registry.isSuccess ? stations.length : null}/> {t('stations')}</span>
      <span><Value value={reporting}/> {t('coverage')}</span>
      <span><Value value={offline}/> {t('offlineStations')}</span>
    </div>
    <div className="dashboard-filters">
      <label>{t('riverFilter')}<select value={river} onChange={e => selectRiver(e.target.value)}>
        <option value="">{t('all')}</option>{[...new Set(stations.map(s => s.river))].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>{t('station')}<select value={code} onChange={e => navigate(`/stations/${e.target.value}/dashboard?${params}`)}>
        {!filtered.some(s => s.code === code) && <option value={code}>{code}</option>}
        {filtered.map(s => <option key={s.code} value={s.code}>{text(s.name)}</option>)}</select></label>
      <label>{t('compareStation')}<select value={comparison || ''} onChange={e => filter('compare', e.target.value)}>
        <option value="">{t('noComparison')}</option>{stations.filter(s => s.code !== code).map(s => <option key={s.code} value={s.code}>{text(s.name)}</option>)}</select></label>
      <label>{t('sensor')}<select value={channel} onChange={e => filter('sensor', e.target.value)}>
        <option value="">{t('allParameters')}</option>{q.data?.sensors.map(s => <option key={s.uid} value={s.channel}>{text(sensorCatalog[s.channel]?.label)}</option>)}</select></label>
      <label>{t('range')}<select value={range} onChange={e => filter('range', e.target.value)}>
        {availableRanges.map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}<option value="custom">{t('customRange')}</option></select></label>
      <label>{t('severity')}<select value={severity} onChange={e => filter('severity', e.target.value)}>
        <option value="">{t('all')}</option>{['info','warning','critical'].map(value => <option key={value} value={value}>{t('severity_' + value)}</option>)}</select></label>
      {range === 'custom' && <><label>{t('rangeStart')}<input type="datetime-local" value={custom} onChange={e => filter('from',e.target.value)}/></label>
        <label>{t('rangeEnd')}<input type="datetime-local" value={customEnd} onChange={e => filter('to',e.target.value)}/></label></>}
    </div>
    <QueryState loading={q.isPending} error={q.error || station.error}/>
    <section className="dashboard-section" aria-label={t('currentSnapshot')}>
      <div className="section-heading"><div><h2>{t('currentSnapshot')}</h2><p>{demoMode ? t('demoSource') : t('historicalSource')}</p></div>
        <div className="station-meta"><StationLifecycle lifecycle={station.data?.lifecycle}/><StatusBadge status={disconnected ? 'unavailable' : q.data?.station_status}/><Source state={disconnected ? undefined : q.data}/></div></div>
      <div className="dashboard-kpis">
        <div><span>{t('activeWarnings')}</span><Value value={online && warning.isSuccess ? warning.data.total : null}/></div>
        <div><span>{t('criticalAlerts')}</span><Value value={online && critical.isSuccess ? critical.data.total : null}/></div>
        <div><span>{t('availabilityInRange')}</span><Value value={window && online && timeline.isSuccess ? timeline.data.availability.pct : null} decimals={1} suffix="%"/></div>
        <div><span>{t('lastFrame')}</span><strong className="dashboard-timestamp">{timestamp ? formatTime(timestamp, i18n.language) : '—'}</strong></div>
      </div>
      <div className="sensor-grid">{sensors.map(sensor => <SensorCard key={sensor.uid} sensor={sensor} disconnected={disconnected}/>)}</div>
    </section>
    <section className="dashboard-section">
      <div className="section-heading"><div><h2>{t('history')}</h2><p>{t('gapsVisible')}</p></div></div>
      {!window ? <p role="status">{t('invalidRange')}</p> : <>
        <p className="range-summary">{formatTime(window.from, i18n.language)} – {formatTime(window.to, i18n.language)}</p>
        <div className="chart-grid">{sensors.map(sensor => <HistoryChart key={sensor.uid + range + comparison + custom + customEnd}
          sensor={sensor} code={code} compare={comparison} window={window} disconnected={disconnected}/>)}</div>
      </>}
    </section>
    {window && <div className="overview-columns dashboard-events">
      <section className="dashboard-section"><h2>{t('timeline')}</h2>
        <QueryState loading={timeline.isLoading} error={timeline.error}/>
        {timeline.data?.items.length ? <ul className="timeline scroll-list" tabIndex={0} aria-label={t('timeline')}>
          {timeline.data.items.map((e, i) => <li key={e.at + i}><strong>{e.type.replaceAll('_', ' ')}</strong><small>{formatTime(e.at, i18n.language)}</small>
            {e.data.alert_id != null && <Link to={'/overview/alerts/' + e.data.alert_id + '?station=' + encodeURIComponent(code)}>{t('alerts')} #{String(e.data.alert_id)}</Link>}</li>)}
        </ul> : timeline.isSuccess && <Empty>{t('noEvents')}</Empty>}
      </section>
      <section className="dashboard-section"><h2>{t('alertsInPeriod')}</h2>
        <QueryState loading={periodAlerts.isLoading} error={periodAlerts.error}/>
        {periodAlerts.isSuccess && <><Value value={periodAlerts.data.total}/><ul className="timeline scroll-list" tabIndex={0} aria-label={t('alertsInPeriod')}>
          {periodAlerts.data.items.map(alert => <li key={alert.id}><Link to={'/overview/alerts/' + alert.id + '?' + alertFilters}>{t('alerts')} #{alert.id}</Link>
            <small>{formatTime(alert.opened_at, i18n.language)}</small></li>)}</ul></>}
      </section>
    </div>}
  </div>;
}

export const HistoryChart = memo(function HistoryChart({ sensor, code, compare, window, disconnected }: { sensor: Sensor; code: string; compare?: string; window: Window; disconnected: boolean }) {
  const { t, i18n } = useTranslation(), text = useText(), reduced = useReducedMotion();
  const [table, setTable] = useState(false), [hidden, setHidden] = useState<string[]>([]), [animated, setAnimated] = useState(false);
  const bucket = compare && Date.parse(window.to) - Date.parse(window.from) <= 3600000 ? '10s' : 'auto';
  const history = useHistory(code, sensor.channel, window.from, window.to, true, bucket);
  const other = useHistory(compare || code, sensor.channel, window.from, window.to, !!compare, bucket);
  const interval = intervals[history.data?.bucket || other.data?.bucket || 'raw'] ?? 2000;
  const points = history.data?.points || [];
  const withinRange = sensor.measured_at && Date.parse(sensor.measured_at) <= Date.parse(window.to);
  const primary = withGaps(disconnected || compare || !withinRange ? points : mergeHistoryTail(points, sensor, window.from), interval);
  const timeAxis = (time: number) => Date.parse(window.to) - Date.parse(window.from) > 86400000
    ? new Intl.DateTimeFormat(i18n.language,{day:'numeric',month:'short',timeZone:'Asia/Ho_Chi_Minh'}).format(time)
    : formatShortTime(new Date(time).toISOString(),i18n.language);
  const secondary = withGaps(compare ? other.data?.points || [] : [], interval);
  const rows = new Map<number, { time: number; primary?: number | null; secondary?: number | null }>();
  for (const point of primary) { const time = Date.parse(point.t); rows.set(time, {time, primary: point.v}); }
  for (const point of secondary) { const time = Date.parse(point.t); rows.set(time, {...rows.get(time), time, secondary: point.v}); }
  const data = Array.from(rows.values()).sort((a,b) => a.time - b.time);
  const series = [{ key: 'primary', name:code, color:'#007982' }, ...(compare ? [{ key:'secondary', name:compare, color:'#7648a9' }] : [])];
  const catalog = sensorTypes.types as Record<string,{ label: { en:string; vi:string }; unit_display:string }>;
  const label = text(catalog[sensor.channel]?.label), unit = catalog[sensor.channel]?.unit_display || sensor.unit;
  const [brush, setBrush] = useState({startIndex:0,endIndex:undefined as number | undefined});
  useEffect(() => {
    if (!data.length || animated || reduced) return;
    const timer = setTimeout(() => setAnimated(true), 650);
    return () => clearTimeout(timer);
  }, [!!data.length, animated, reduced]);
  const csv = () => {
    const url = URL.createObjectURL(new Blob([historyCsv(points, sensor.unit)], {type:'text/csv;charset=utf-8'}));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${code}-${sensor.channel}-${demoMode ? 'demo' : 'simulated'}.csv`;
    anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  return <section className="dashboard-chart" aria-label={label}>
    <div className="section-heading"><div><h3>{label}</h3><p>{unit} · {demoMode ? t('demoSource') : t('historicalSource')}</p></div>
      <div className="button-group"><button onClick={() => setTable(!table)}>{t(table ? 'chart' : 'table')}</button>
        <button disabled={!points.length || history.isError} onClick={csv} aria-label={t('csv')}><Download size={15}/></button></div></div>
    <QueryState loading={history.isLoading || (!!compare && other.isLoading)} error={history.error || other.error}/>
    <div className="chart-content">
      {!data.length ? (!history.isLoading && (!compare || !other.isLoading) && <Empty>{t('noHistory')}</Empty>) : table ?
        <div className="table-wrap scroll-list" role="region" aria-label={label + ' · ICT'} tabIndex={0}><table>
          <thead><tr><th>{t('time')}</th>{series.map(item => <th key={item.key}>{item.name} · {unit}</th>)}</tr></thead>
          <tbody>{data.map(row => <tr key={row.time}><td>{formatTime(new Date(row.time).toISOString(), i18n.language)}</td>
            <td>{formatValue(row.primary, sensor.decimals, i18n.language)}</td>{compare && <td>{formatValue(row.secondary, sensor.decimals, i18n.language)}</td>}</tr>)}</tbody>
        </table></div> : <>
          <div className="chart-series" aria-label={t('chartSeries')}>
            {series.map(item => <button key={item.key} type="button" aria-pressed={!hidden.includes(item.key)}
              onClick={() => setHidden(previous => previous.includes(item.key) ? previous.filter(key => key !== item.key) : [...previous,item.key])}>
              <span style={{background:item.color}}/>{item.name}</button>)}
            {(brush.startIndex > 0 || brush.endIndex != null) && <button type="button" onClick={() => setBrush({startIndex:0,endIndex:undefined})}>{t('resetZoom')}</button>}
          </div>
          <ResponsiveContainer width="100%" height={245} minWidth={0}>
            <LineChart data={data} margin={{left:0,right:14,top:10,bottom:4}}>
              <CartesianGrid vertical={false} stroke="#dce8e5" strokeDasharray="3 4"/>
              <XAxis dataKey="time" type="number" scale="time" domain={['dataMin','dataMax']} minTickGap={40}
                tickFormatter={timeAxis} tick={{fontSize:10}}/>
              <YAxis width={45} tick={{fontSize:10}}/>
              <Tooltip labelFormatter={n => formatTime(new Date(Number(n)).toISOString(), i18n.language)} formatter={n => formatValue(Number(n), sensor.decimals, i18n.language) + ' ' + unit}/>
              {series.map(item => <Line key={item.key} dataKey={item.key} name={item.name} stroke={item.color} strokeWidth={2.5}
                hide={hidden.includes(item.key)} dot={false} activeDot={{r:4}} connectNulls={false} isAnimationActive={!reduced && !animated && !brush.endIndex} animationDuration={600}/>)}
              {data.length > 8 && <Brush dataKey="time" height={25} travellerWidth={8} stroke="#6e9b96" fill="#f2f8f6"
                tickFormatter={timeAxis}
                startIndex={Math.min(brush.startIndex, data.length - 1)} endIndex={brush.endIndex == null ? data.length - 1 : Math.min(brush.endIndex,data.length - 1)}
                onChange={value => { if (value.startIndex !== undefined) setBrush({startIndex:value.startIndex,endIndex:value.endIndex}); }}/>}
            </LineChart>
          </ResponsiveContainer>
        </>}
    </div>
  </section>;
});
