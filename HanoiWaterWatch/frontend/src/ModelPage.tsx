import { Component, lazy, Suspense, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Box, ArrowUpRight, RotateCcw } from 'lucide-react';
import { useStationState, useStation, useOnline } from './api';
import { SensorCard, QueryState, StatusBadge, useText, Source, statusColor, Empty } from './common';
import type { Sensor } from './types';
import { displayCurrent, formatTime, formatValue } from './domain';
const ModelCanvas = lazy(() => import('./ModelCanvas'));
class Boundary extends Component<{
    children: React.ReactNode;
    fallback: React.ReactNode;
}, {
    failed: boolean;
}> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
export default function ModelPage() {
    const { code = 'HWW-KNG-001' } = useParams();
    const q = useStationState(code), meta = useStation(code), online = useOnline();
    const disconnected = !online || q.isError;
    const { t } = useTranslation(), text = useText();
    const [params, setParams] = useSearchParams();
    const selected = params.get('sensor') || 'turbidity';
    const select = (channel: string) => { const next = new URLSearchParams(params); next.set('sensor',channel); setParams(next); };
    const [mode, setMode] = useState('2d');
    const [asset, setAsset] = useState<boolean | null>(null);
    const [reset, setReset] = useState(0);
    const sensors = q.data?.sensors || [];
    const sensor = sensors.find(s => s.channel === selected) || sensors[0];
    const schematic = <div className='schematic-wrap'><Schematic sensors={sensors} selected={selected} onSelect={select}/><div className='schematic-buttons'>{['ph', 'do', 'turbidity', 'temp'].map((ch, i) => <button key={ch} className={selected === ch ? 'selected' : ''} style={{ left: (23.68 + i * 8.68) + '%' }} onClick={() => select(ch)} aria-label={'Select ' + ch + ' sensor'}>{ch.toUpperCase()}</button>)}</div></div>;
    async function open3d() { try {
        const r = await fetch('/models/station-v1.glb');
        const b = await r.arrayBuffer();
        const available = r.ok && b.byteLength > 4 && new DataView(b).getUint32(0, true) === 0x46546c67;
        setAsset(available);
        if (available)
            setMode('3d');
    }
    catch {
        setAsset(false);
    } }
    useEffect(() => { void open3d(); }, []);
    useEffect(() => { const handler = () => { setMode('2d'); setAsset(false); }; document.addEventListener('hww-context-lost', handler); return () => document.removeEventListener('hww-context-lost', handler); }, []);
    if (q.isPending || meta.isPending) return <section className="panel detail-body"><h1>{code}</h1><QueryState loading error={null}/></section>;
    return <><div className="page-title"><div><div className="eyebrow">{t('model')} / {code}</div><h1>{text(meta.data?.name)}</h1><p>{t('selectSensor')}</p></div><Link className="button" to={`/stations/${code}/dashboard?${params}`}>{t('dashboard')} <ArrowUpRight size={16}/></Link></div><QueryState loading={q.isLoading} error={q.error}/><div className="station-meta"><StatusBadge status={disconnected ? 'unavailable' : q.data?.station_status}/><Source state={q.data}/><Link className="textlink" to={'/map?station=' + code}>{t('viewMap')}</Link><span>{t('lastFrame')}: {formatTime(q.data?.last_frame_at)}</span><span>{t('snapshot')} v{q.data?.version ?? '—'}</span></div><div className={'model-layout ' + (disconnected ? 'stale-state' : '')}><section className="panel model-panel"><div className="panel-head"><h2><Box size={18}/>{t('model')}</h2><div className="button-group"><button className={mode === '2d' ? 'active' : ''} onClick={() => setMode('2d')}>{t('schematic')}</button><button className={mode === '3d' ? 'active' : ''} onClick={() => void open3d()}>{t('model3d')}</button><button aria-label={t('reset')} disabled={mode !== "3d"} onClick={() => setReset(v => v + 1)}><RotateCcw size={14}/></button></div></div><div className="model-viewport" aria-label={disconnected ? t('error') : undefined}>{mode === '3d' ? <Boundary fallback={schematic}><Suspense fallback={<Empty>{t('loading')}</Empty>}><ModelCanvas key={reset} sensors={sensors} status={disconnected ? 'unavailable' : q.data?.station_status || 'unavailable'} onSelect={select}/></Suspense></Boundary> : schematic}</div><div className="model-foot">{disconnected ? t('error') : asset === false ? t('modelMissing') : mode === '2d' ? t('selectSensor') : t('selectSensor')}</div></section><aside className="model-aside"><details className="model-inspector" open><summary>{t('parameters')}</summary><section className="panel"><div className="panel-head"><h2>{t('sensor')}</h2><span className="badge">{q.isSuccess ? sensors.length : '—'}</span></div><div className="sensor-list scroll-list" role="region" aria-label={t('sensor')} tabIndex={0}>{sensors.map(s => <button className={s.channel === selected ? 'selected' : ''} key={s.uid} onClick={() => select(s.channel)}><span><strong>{s.channel === 'temp' ? t('tempLabel') : s.channel === 'do' ? t('oxygenLabel') : s.channel === 'ph' ? 'pH' : t('turbidityLabel')}</strong><StatusBadge status={disconnected ? 'unavailable' : s.status}/></span><b>{formatValue(displayCurrent(s.value, s.status, disconnected), s.decimals)}<small>{s.unit === 'degC' ? '°C' : s.unit}</small></b></button>)}</div></section>{sensor && <SensorCard sensor={sensor} disconnected={disconnected}/>}</details></aside></div></>;
}
function Schematic({ sensors, selected, onSelect }: {
    sensors: Sensor[];
    selected: string;
    onSelect: (s: string) => void;
}) { return <svg className="schematic" viewBox="0 0 760 480" aria-hidden="true"><defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#cbd5e1"/></pattern><linearGradient id="water" x2="0" y2="1"><stop stopColor="#bae6fd"/><stop offset="1" stopColor="#e0f2fe"/></linearGradient></defs><rect width="760" height="480" fill="url(#grid)"/><path d="M0 355Q95 338 190 355T380 355T570 355T760 355V480H0Z" fill="url(#water)"/><path d="M70 380Q170 362 270 380T470 380T670 380" fill="none" stroke="#7dd3fc" strokeWidth="2"/><path d="M80 324H660" stroke="#64748b" strokeWidth="10" strokeLinecap="round"/><path d="M150 324V445M610 324V445" stroke="#94a3b8" strokeWidth="12"/><rect x="440" y="140" width="136" height="184" rx="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/><rect x="455" y="157" width="106" height="55" rx="4" fill="#0f172a"/><text x="508" y="180" textAnchor="middle" fill="#7dd3fc" fontSize="11">HANOI WATERWATCH</text><text x="508" y="200" textAnchor="middle" fill="#94a3b8" fontSize="10">ESP32 · SIMULATED</text><rect x="493" y="112" width="30" height="28" rx="8" fill="#cbd5e1" stroke="#64748b"/><path d="M508 140V94" stroke="#64748b"/><path d="M462 252H554M462 264H554M462 276H554" stroke="#94a3b8" strokeWidth="3"/>{['ph', 'do', 'turbidity', 'temp'].map((ch, i) => { const s = sensors.find(s => s.channel === ch), x = 180 + i * 66, c = s ? statusColor(s.status) : '#cbd5e1'; return <g key={ch} aria-label={`Select ${ch} sensor, ${s?.status || 'no data'}`} onClick={() => onSelect(ch)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onSelect(ch);
} }} style={{ cursor: 'pointer' }}><path d={`M${x} 365V240Q${x} 229 ${x + 12} 229H440`} fill="none" stroke="#94a3b8" strokeWidth="2"/><rect x={x - 12} y="360" width="24" height="56" rx="8" fill={c} stroke={selected === ch ? '#0369a1' : '#fff'} strokeWidth={selected === ch ? 4 : 2}/><circle cx={x} cy="291" r="18" fill="#fff" stroke={selected === ch ? '#0284c7' : '#cbd5e1'} strokeWidth="2"/><text x={x} y="295" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">{ch.toUpperCase()}</text></g>; })}<text x="80" y="68" fill="#64748b" fontSize="11" letterSpacing="2">STATION SCHEMATIC / ILLUSTRATIVE</text><text x="80" y="94" fill="#0f172a" fontSize="22" fontWeight="700">Connected water monitoring</text><text x="80" y="450" fill="#0369a1" fontSize="11">SIMULATED WATER INPUTS</text></svg>; }
