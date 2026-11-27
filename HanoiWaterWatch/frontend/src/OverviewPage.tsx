import StationLifecycle from './StationLifecycle';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Activity, Bell, Radio, Map } from 'lucide-react';
import { useOnline } from './api';
import AlertsPage from './AlertsPage';
import { Clock, QueryState, Source, StatusBadge, useText } from './common';
import { useNetworkStations } from './useNetworkStations';

export default function OverviewPage({ alertsFirst = false }: { alertsFirst?: boolean }) {
  const { t } = useTranslation();
  return <>
    {alertsFirst ? <Link className="back-link" to="/overview">{t('networkSummary')}</Link> : <NetworkSummary/>}
    <AlertsPage embedded={!alertsFirst}/>
  </>;
}

function NetworkSummary() {
  const { t } = useTranslation(), text = useText();
  const { registry, snapshotQueries } = useNetworkStations();
  const online = useOnline();
  const stations = registry.data?.items || [];
  const states = snapshotQueries.map(q => online && q.isSuccess && !q.isPaused ? q.data : undefined);
  const complete = registry.isSuccess && states.length === stations.length && states.every(Boolean);
  const lastUpdate = states.flatMap(s => s ? [s.generated_at] : []).sort().at(-1);
  const metrics = [
    { label:'stations', value:registry.isSuccess ? stations.length : '—', icon:MapPin },
    { label:'attention', value:complete ? states.filter(s => ['degraded','offline','abnormal','sensor_fault'].includes(s!.station_status)).length : '—', icon:Activity },
    { label:'openAlerts', value:complete ? states.reduce((total,s) => total + s!.open_alert_count,0) : '—', icon:Bell },
    { label:'coverage', value:complete ? states.filter(s => s?.sensors.some(sensor => sensor.value !== null)).length : '—', icon:Radio },
  ];
  const retry = () => { void registry.refetch(); snapshotQueries.forEach(q => void q.refetch()); };
  return <>
    <div className="page-title"><div><h1>{t('networkSummary')}</h1><p>{t('currentSnapshot')} · {t('snapshotAt')} <span className="overview-clock"><Clock at={lastUpdate}/></span></p></div>
      <Link className="button primary" to="/map"><Map size={16}/>{t('mapHome')}</Link>
    </div>
    <div className="metrics">{metrics.map(({label,value,icon:Icon}) => <article className="metric" key={label}><div className="between">{t(label)}<Icon size={18}/></div><strong>{value}</strong>{label === 'coverage' && <small>{t('coverageDetail')}</small>}</article>)}</div>
    
    {(registry.isError || snapshotQueries.some(q => q.isError)) && <button className="button" onClick={retry}>{t('error')} · {t('retry')}</button>}
    <section className="panel overview-directory"><div className="panel-head"><h2>{t('directory')}</h2><MapPin size={18}/></div>
      <QueryState loading={registry.isLoading} error={registry.error}/>
      {stations.map((s,i) => <article className="overview-station station-row" key={s.code}>
        <div><small>{s.code}</small><h3>{text(s.name)}</h3><StationLifecycle lifecycle={s.lifecycle}/><StatusBadge status={states[i]?.station_status}/></div>
        <div>{s.data_mode === 'planned' ? t('planned') : <Source state={states[i]}/>}<small><Clock at={states[i]?.last_frame_at}/></small></div>
        <Link className="button" to={'/map?station=' + encodeURIComponent(s.code)} aria-label={t('viewMap') + ' · ' + s.code}><Map size={16}/></Link>
      </article>)}{registry.isSuccess && !stations.length && <p className="detail-body">{t('noData')}</p>}
    </section>
    <div className="evidence-note"><strong>{t('evidenceClasses')}</strong><span>{t('simulatedAnomaly')}</span><span>{t('observationReserved')}</span><span>{t('incidentFieldOnly')}</span></div>
  </>;
}
