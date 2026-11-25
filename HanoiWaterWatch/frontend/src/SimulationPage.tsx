import { Link, useSearchParams } from 'react-router-dom';
import { demoMode } from './features';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Cloud, Database, Monitor, ArrowRight, ExternalLink, Play, Square, Radio } from 'lucide-react';
import { useResource, useUser, useOnline, useStations, useAction } from './api';
import { QueryState, Empty } from './common';
import { formatTime,formatValue,activeReplayId } from './domain';
import sensorCatalog from '../../shared/registry/sensor_types.json';

function DemoResults({ payload }: { payload: unknown }) {
  const {t,i18n} = useTranslation();
  const result = payload as { source?:string; baseline?:Record<string,number|null>; frames?:{measurements:Record<string,number|null>}[] } | undefined;
  const output = result?.frames?.at(-1)?.measurements;
  if (result?.source !== 'demo_simulation' || !output) return null;
  return <div className="detail-body scroll-list" role="region" aria-label={t('inspectResults')} tabIndex={0}>
    <table><thead><tr><th>{t('sensor')}</th><th>{t('baseline')}</th><th>{t('inspectResults')}</th></tr></thead><tbody>
      {Object.entries(sensorCatalog.types).map(([key,type]) => <tr key={key}><th scope="row">{type.label[i18n.language === 'vi' ? 'vi' : 'en']}</th>
        <td>{formatValue(result.baseline?.[key],type.decimals,i18n.language)} {type.unit_display}</td>
        <td>{formatValue(output[key],type.decimals,i18n.language)} {type.unit_display}</td></tr>)}
    </tbody></table>
  </div>;
}
interface LinkData {
    link_status: string;
    session: {
        id: string;
        station_code?:string;
        ended_at?:string|null;
        source: string;
        device_code: string;
        boot_id: string;
        fw_version: string;
        frames_accepted: number;
        frames_duplicate: number;
        frames_rejected: number;
    } | null;
    last_frame_received_at: string | null;
    diag: Record<string, number> | null;
    last_error: unknown;
    last_batch: unknown;
}
export default function SimulationPage() { const { t } = useTranslation(), user = useUser(), action = useAction(), online = useOnline(); const [params, setParams] = useSearchParams(), registry = useStations();
    const code = params.get('station') || 'HWW-KNG-001';
    const station = registry.data?.items.find(s => s.code === code);
    const [recording, setRecording] = useState('demo-golden'), [speed, setSpeed] = useState(1), [takeover, setTakeover] = useState(false), [optimisticRun, setOptimisticRun] = useState<{stationCode:string;id:string;observedAt:number}>(); const link = useResource<LinkData>('link', `/stations/${code}/link`, 2000), meta = useResource<{
    wokwi_project_url: string | null;
}>('meta', '/meta'), replays = useResource<{
    items: Array<{
        name: string;
        duration_s: number;
    }>;
}>('replays', '/replays', 30000, !!user.data); const d = link.data;const pendingRun=optimisticRun?.stationCode===code&&link.dataUpdatedAt<=optimisticRun.observedAt?optimisticRun.id:undefined;const run=activeReplayId(code,d?.link_status,d?.session)||pendingRun; return <><div className="page-title"><div><div className="eyebrow">{t('simulation')}</div><h1>{t('simWorkspace')}</h1><p>{t('pipelineIntro')}</p></div><span className="badge">{t('source')}</span></div><section className="pipeline">{(demoMode ? [{ icon: Database, title: t('demoSource'), sub: t('demoIndicator') }, { icon: Play, title: t('scenario'), sub: t('replayControls') }, { icon: Monitor, title: t('inspectResults'), sub: t('demoSimulation') }] : [{ icon: Cpu, title: 'Wokwi ESP32', sub: t('simInputs') }, { icon: Cloud, title: 'HTTPS ingest', sub: t('validateDedupe') }, { icon: Database, title: 'PostgreSQL', sub: t('persistEvaluate') }, { icon: Monitor, title: 'WaterWatch', sub: t('oneState') }]).map((p, i) => <div className="pipeline-item" key={p.title}><span className="pipeline-icon"><p.icon size={25}/></span><strong>{p.title}</strong><small>{p.sub}</small>{i < (demoMode ? 2 : 3) && <ArrowRight className="pipeline-arrow" size={20}/>}</div>)}</section><div className="simulation-layout"><div><section className="panel"><div className="panel-head"><h2><Play size={17}/>{t('replayControls')}</h2><span className="badge">{t('source')}</span></div><div className="detail-body"><label>{t('station')}<select value={code} onChange={e => { setParams({station:e.target.value}); setTakeover(false); action.reset(); }}>{registry.data?.items.map(s => <option key={s.code} value={s.code}>{s.code} · {s.river}</option>)}</select></label><QueryState loading={replays.isLoading} error={replays.error}/>{!user.data ? <Link className="button" to={'/login?returnTo=' + encodeURIComponent('/simulation?station=' + code)}>{t('signInActions')}</Link> : <><div className="replay-grid"><label>{t('recording')}<select value={recording} onChange={e => setRecording(e.target.value)}>{replays.data?.items.map(r => <option key={r.name} value={r.name}>{r.name} · {r.duration_s}s</option>)}</select></label><label>{t('speed')}<select value={speed} onChange={e => setSpeed(Number(e.target.value))}>{[1, 2, 5].map(s => <option key={s} value={s}>{s}×</option>)}</select></label><button className="button primary" disabled={action.isPending || !replays.data?.items.length || !!run || !station || station.data_mode === 'planned' || !online || link.isError} onClick={() => { if (takeover && !window.confirm(t('confirmTakeover'))) return; action.mutate({ path: `/replays/${recording}/runs`, body: { station_code: code, speed, takeover, loop: false } }, { onSuccess: r => setOptimisticRun({stationCode:code,id:r.session_id as string,observedAt:link.dataUpdatedAt}) }); }}><Play size={15}/>{t('run')}</button>{(!!run) && <button className="button" disabled={!online || action.isPending} onClick={() => action.mutate({ path: `/replay-runs/${run}/stop`, body: {} }, { onSuccess: () => setOptimisticRun(undefined) })}><Square size={15}/>{t('stop')}</button>}</div>{station?.data_mode === 'planned' && <p>{t('planned')}</p>}<label className="checkbox"><input type="checkbox" checked={takeover} onChange={e => setTakeover(e.target.checked)}/>{t('takeover')}</label>{action.isError && <div className="error" role="alert">{action.error.message}</div>}{action.isSuccess && <p className="success" role="status">{t('replayAccepted')}</p>}</>}</div></section></div><div><section className="panel"><div className="panel-head"><h2>{t('inspectResults')}</h2><span className="badge">{demoMode ? 'demo.simulation.v1' : 'hww.frames.v1'}</span></div>{demoMode && <p className="demo-result-note">{t('demoSimulation')}</p>}{demoMode && <DemoResults payload={d?.last_batch}/>}{d?.last_batch ? <pre className="payload scroll-list" tabIndex={0} aria-label={t('inspectResults')}>{JSON.stringify(d.last_batch, null, 2)}</pre> : <Empty>{t('noPayload')}</Empty>}</section><div className="context-links"><Link className="button" to={'/stations/' + code + '/dashboard'}>{t('compareHistory')}</Link><Link className="textlink" to={'/map?station=' + code}>{t('viewMap')}</Link></div></div></div><div className="detail-grid"><section className="panel"><div className="panel-head"><h2><Cpu size={18}/>{t('circuitTitle')}</h2></div><div className="detail-body"><p>{t('instructions')}</p><div className="circuit-board"><Cpu size={44}/><strong>ESP32</strong><span>pH · DO · Turbidity · Temperature</span><small>pot_ph → GPIO34 &nbsp; pot_do → GPIO35</small><small>pot_turb → GPIO32 &nbsp; DS18B20 → GPIO4</small></div>{meta.data?.wokwi_project_url ? <a className="button primary" href={meta.data.wokwi_project_url} target="_blank" rel="noopener noreferrer">{t('wokwiLink')}<ExternalLink size={15}/></a> : <p className="muted">{t('noLink')}</p>}</div></section><section className="panel"><div className="panel-head"><h2><Radio size={18}/>{t('connection')}</h2><span className="badge">{d?.link_status || t('waiting')}</span></div><div className="detail-body"><QueryState loading={link.isLoading} error={link.error}/><dl><div><dt>{t('lastFrame')}</dt><dd>{formatTime(d?.last_frame_received_at)}</dd></div><div><dt>{t('deviceLabel')}</dt><dd>{d?.session ? `${d.session.source} / ${d.session.device_code}` : '—'}</dd></div><div><dt>{t('bootFirmware')}</dt><dd>{d?.session ? `${d.session.boot_id} / ${d.session.fw_version}` : '—'}</dd></div><div><dt>{t('acceptedCounts')}</dt><dd>{d?.session ? `${d.session.frames_accepted} / ${d.session.frames_duplicate} / ${d.session.frames_rejected}` : '—'}</dd></div><div><dt>{t('diagnostics')}</dt><dd>{d?.diag ? JSON.stringify(d.diag) : '—'}</dd></div><div><dt>{t('lastError')}</dt><dd>{d?.last_error ? JSON.stringify(d.last_error) : '—'}</dd></div></dl></div></section></div><section className="panel"><div className="panel-head"><h2>{t('scenario')}</h2><span className="badge">{t('warmUp')}</span></div><div className="scenarios">{[{ n: '01', title: t('normalOperation'), body: t('normalInstructions') }, { n: '02', title: t('spikeTitle'), body: t('spikeInstructions') }, { n: '03', title: t('oxygenDrop'), body: t('oxygenInstructions') }, { n: '04', title: t('faultTitle'), body: t('faultInstructions') }, { n: '05', title: t('networkInterruption'), body: t('networkInstructions') }, { n: '06', title: t('recovery'), body: t('recoveryInstructions') }].map(s => <article key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></section></>; }
