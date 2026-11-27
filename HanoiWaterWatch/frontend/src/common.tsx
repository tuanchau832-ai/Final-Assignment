import { useQueryClient } from '@tanstack/react-query';
import { ApiError } from './api';
import { demoMode } from './features';
import { useClock } from './clock';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, WifiOff, Wrench, MinusCircle, AlertCircle, ArrowUpRight, Beaker, Wind, Waves, Thermometer } from 'lucide-react';
const SENSOR_ICON: Record<string, typeof Beaker> = { ph: Beaker, do: Wind, turbidity: Waves, temp: Thermometer };
import { Link } from 'react-router-dom';
import visuals from '../../shared/registry/status_visuals.json';
import sensorTypes from '../../shared/registry/sensor_types.json';
import { displayCurrent, formatTime, formatValue } from './domain';
import type { Status, LocalText, Sensor, Snapshot, Alert } from './types';
export function useText() { const { i18n } = useTranslation(); return (s: LocalText | undefined) => typeof s === 'string' ? s : s?.[i18n.language as 'en' | 'vi'] || s?.en || '—'; }
export function StatusBadge({ status = 'unavailable' }: {
    status?: Status;
}) { const { i18n } = useTranslation(); const v = visuals.statuses[status]; const I = { normal: CheckCircle2, abnormal: AlertTriangle, sensor_fault: Wrench, offline: WifiOff, unavailable: MinusCircle, degraded: AlertCircle }[status]; return <span className={'status status-' + status} style={{ color: v.text }}><I size={13}/>{v.label[i18n.language as 'en' | 'vi'] || v.label.en}</span>; }
export const statusColor = (s: Status) => visuals.statuses[s].fill;
export function Clock({ at }: {
    at: string | null | undefined;
}) { const { i18n } = useTranslation(); const now = useClock(); return <time dateTime={at || undefined} title={formatTime(at, i18n.language)}>{at ? `${formatTime(at, i18n.language)} · ${Math.max(0, Math.floor((now - Date.parse(at)) / 1000))}s` : '—'}</time>; }
export function Source({ state }: {
    state?: Snapshot;
}) { const { t } = useTranslation(); return <span className="source"><span />{t(!state?.session ? 'waiting' : state.session.source === 'demo_dataset' ? 'demoSource' : state.session.source === 'simulated_replay' ? 'replay' : 'wokwi')}</span>; }
export function Empty({ children }: {
    children?: React.ReactNode;
}) { const { t } = useTranslation(); return <div className="empty"><MinusCircle size={26}/><p>{children || t('noData')}</p></div>; }
export function QueryState({ loading, error }: {
    loading: boolean;
    error: unknown;
}) { const { t } = useTranslation(); const client = useQueryClient(); return loading ? <div className="skeleton" aria-busy="true">{t('loading')}</div> : error ? <div className="error" role="alert">{error instanceof ApiError && error.status === 404 ? <><p>{t('notFound')}</p><Link to='/'>{t('return')}</Link></> : <>{t('error')} <button className="button" onClick={() => void client.refetchQueries({type:'active',predicate:q => q.state.status === 'error'})}>{t('retry')}</button></>}</div> : null; }
export function SensorCard({ sensor, disconnected = false, onClick }: {
    sensor: Sensor;
    disconnected?: boolean;
    onClick?: () => void;
}) { const { t, i18n } = useTranslation(); const text = useText(); const types = sensorTypes.types as Record<string, {
    label: LocalText;
    unit_display: string;
}>; const v = displayCurrent(sensor.value, sensor.status, disconnected); const Icon = SENSOR_ICON[sensor.channel] || Waves; return <article data-channel={sensor.channel} className={'sensor-card ' + (disconnected ? 'stale-state ' : '') + (onClick ? 'clickable' : '')} onClick={onClick}><div className="between"><span className="eyebrow"><i className="sensor-icon"><Icon size={16}/></i>{text(types[sensor.channel]?.label) || sensor.channel}</span><span className="sensor-dot" style={{ background: statusColor(disconnected ? 'unavailable' : sensor.status) }}/></div><div className="reading">{formatValue(v, sensor.decimals, i18n.language)} <small>{types[sensor.channel]?.unit_display || sensor.unit}</small></div><StatusBadge status={disconnected ? 'unavailable' : sensor.status}/>{disconnected && <small>{t('lastKnown')}</small>}<div className="measured"><Clock at={sensor.measured_at}/></div>{sensor.last_valid && <small>{t('lastValid')}: {formatValue(sensor.last_valid.value, sensor.decimals)} · {formatTime(sensor.last_valid.measured_at)}</small>}{sensor.fault_reason && <small>{sensor.fault_reason}</small>}{sensor.active_alert_id && <Link className="textlink" to={'/overview/alerts/' + sensor.active_alert_id}>#{sensor.active_alert_id} <ArrowUpRight size={12}/></Link>}</article>; }
export function AlertRows({ items, search }: {
    search?: string;
    items: Alert[];
}) { const { t } = useTranslation(); const text = useText(); return items.length ? <div className="alert-rows scroll-list" role="region" aria-label={t('alerts')} tabIndex={0}>{items.map(a => <Link key={a.id} to={'/overview/alerts/' + a.id + (search ? '?' + search : '')} className="alert-row"><span className={'alert-symbol ' + a.severity}><AlertTriangle size={18}/></span><div><strong>{text(a.rule_name) || a.rule_code}</strong><small>#{a.id} · {a.station_code} · {formatTime(a.opened_at)}</small></div><div className="alert-tags"><span className="badge amber">{a.severity}</span><span className="badge">{t(demoMode ? 'demoSource' : 'source')}</span><span className="badge">{a.review_status.replaceAll('_', ' ')}</span></div><ArrowUpRight size={17}/></Link>)}</div> : <Empty>{t('noAlerts')}</Empty>; }
