import { useEffect, useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ChevronDown, ChevronUp, Filter, Layers, List, MapPin, Search, X, BookOpen, SlidersHorizontal, Plus, Minus, LocateFixed, FlaskConical, ArrowLeft } from 'lucide-react';
import { api, useAlerts, useHistory } from './api';
import { useNetworkStations } from './useNetworkStations';
import { displayCurrent, formatShortTime, formatTime, formatValue, rollingWindow } from './domain';
import { Clock, Source, StatusBadge, useText } from './common';
import { demoMode } from './features';
import { useClock } from './clock';
import type { Snapshot, Station, Status } from './types';
import type { Map as LeafletMap } from 'leaflet';
import StationMap, { fitStations } from './StationMap';
import { Cascade, IconButton, stagger } from './FloatingControls';
import { matchesStation, snapshotStatus } from './mapStations';
import { useMapLabel } from './mapLabels';
import StationLifecycle from './StationLifecycle';
import visuals from '../../shared/registry/status_visuals.json';
import sensorTypes from '../../shared/registry/sensor_types.json';

type Tool = 'filters' | 'layers' | 'legend';
type Size = 'min' | 'preview' | 'full';
const sensorType = (channel: string) => sensorTypes.types[channel as keyof typeof sensorTypes.types];
const filterKeys = ['q', 'status', 'river', 'channel', 'severity'];

function Trend({ code, channel }: { code: string; channel: string }) {
  const now = useClock(), { t, i18n } = useTranslation(), label = useMapLabel();
  const { from, to } = rollingWindow(now, .25), history = useHistory(code, channel, from, to);
  const last = history.data?.points.slice(-5) || [];
  return <section className="inspect-section"><h3>{label('trend')} · {sensorType(channel)?.label[i18n.language === 'vi' ? 'vi' : 'en'] || channel}</h3>
    {history.isError || history.isPaused ? <p>{t('error')} <button onClick={() => void history.refetch()}>{label('retry')}</button></p>
      : history.isLoading ? <p>{t('loading')}</p> : !last.length ? <p>{t('noHistory')}</p>
      : <table className="trend-table"><caption>{label('latestSamples')} · ICT</caption>
        <thead><tr><th scope="col">{t('time')}</th><th scope="col">{t('value')} ({sensorType(channel)?.unit_display || history.data?.unit})</th></tr></thead>
        <tbody>{last.map(point => <tr key={point.t}><td><time dateTime={point.t} title={formatTime(point.t, i18n.language)}>{formatShortTime(point.t, i18n.language)}</time></td><td>{formatValue(point.v, history.data?.decimals, i18n.language)}</td></tr>)}</tbody>
      </table>}
  </section>;
}

function Inspector({ station, state, disconnected, loading, close, retry, channel, focusOnMount }: {
  station: Station; state?: Snapshot; disconnected: boolean; loading: boolean;
  close: () => void; retry: () => void; channel: string | null; focusOnMount: boolean
}) {
  const { t, i18n } = useTranslation(), text = useText(), label = useMapLabel(), ref = useRef<HTMLHeadingElement>(null);
  const [size, setSize] = useState<Size>('preview');
  const alerts = useAlerts('station=' + encodeURIComponent(station.code) + '&active=true&limit=3');
  const sensors = state?.sensors || [], previewChannel = channel || sensors[0]?.channel || station.sensors?.[0]?.channel;
  const stationQuery = '?station=' + encodeURIComponent(station.code);
  useEffect(() => { if (focusOnMount) ref.current?.focus({ preventScroll: true }); }, [station.code, focusOnMount]);
  return <aside className={'station-inspector sheet-' + size} aria-label={label('details')}>
    <div className="inspect-top"><span className="inspect-code"><MapPin size={15}/>{station.code}</span>
      <div className="inspect-buttons"><IconButton className="sheet-resize" aria-label={size === 'full' ? label('collapse') : label('expand')}
        aria-expanded={size === 'full'} onClick={() => setSize(size === 'full' ? 'preview' : 'full')}>{size === 'full' ? <ChevronDown/> : <ChevronUp/>}</IconButton>
        {size === 'preview' && <IconButton className="sheet-resize" aria-label={label('minimize')} onClick={() => setSize('min')}><ChevronDown/></IconButton>}
        <IconButton aria-label={label('close')} onClick={close}><X size={19}/></IconButton></div></div>
    <h2 tabIndex={-1} ref={ref}>{text(station.name)}</h2>
    <div className="inspect-status"><StationLifecycle lifecycle={station.lifecycle}/><StatusBadge status={snapshotStatus(state, disconnected)}/>{station.data_mode === 'planned' ? <small>{t('planned')}</small> : <Source state={state}/>}</div>
    <div className="inspect-body">
      <dl className="inspect-metadata"><div><dt>{label('river')}</dt><dd>{station.river}</dd></div>
        <div><dt>{label('coords')}</dt><dd>{station.location.lat.toFixed(3)}° N · {station.location.lng.toFixed(3)}° E</dd></div>
        <div><dt>{t('lastFrame')}</dt><dd><Clock at={state?.last_frame_at}/></dd></div></dl>
      {disconnected && <p className="inspect-warning" role="status">{label('stale')} <button onClick={retry}>{label('retry')}</button></p>}
      {loading && <p aria-busy="true">{t('loading')}</p>}
      <section className="inspect-section"><h3>{label('latest')}</h3>
        {sensors.length ? <dl className="inspect-readings">{sensors.map(sensor => <div key={sensor.uid}>
          <dt>{text(sensorType(sensor.channel)?.label)}</dt>
          <dd>{formatValue(displayCurrent(sensor.value, sensor.status, disconnected), sensor.decimals, i18n.language)} <small>{sensorType(sensor.channel)?.unit_display || sensor.unit}</small></dd>
          <dd className="inspect-reading-status"><StatusBadge status={disconnected ? 'unavailable' : sensor.status}/></dd>
        </div>)}</dl> : <p>{t('noData')}</p>}
      </section>
      {previewChannel && <Trend code={station.code} channel={previewChannel}/>}
      <section className="inspect-section"><h3>{label('active')}</h3>
        {alerts.isError || alerts.isPaused ? <p>{t('error')} <button onClick={() => void alerts.refetch()}>{label('retry')}</button></p>
          : alerts.isLoading ? <p>{t('loading')}</p> : alerts.data?.items.length
            ? alerts.data.items.map(alert => <Link className="inspect-alert" to={'/overview/alerts/' + alert.id + stationQuery} key={alert.id}>{text(alert.rule_name)} · {alert.severity}<ArrowUpRight size={14}/></Link>) : <p>{t('noAlerts')}</p>}
      </section>
      <nav className="inspect-links" aria-label={label('details')}>
        <Link to={'/stations/' + station.code + '/dashboard'}>{t('dashboard')} <ArrowUpRight/></Link>
        <Link to={'/stations/' + station.code + '/model'}>{t('model')} <ArrowUpRight/></Link>
        <Link to={'/overview/alerts' + stationQuery}>{t('alerts')} <ArrowUpRight/></Link>
      </nav>
    </div>
  </aside>;
}

export default function MapHome() {
  const { t, i18n } = useTranslation(), text = useText(), label = useMapLabel();
  const { registry, stations, snapshotQueries } = useNetworkStations(), location = useLocation();
  const [params, setParams] = useSearchParams(), [tool, setTool] = useState<Tool | null>(null);
  const [expanded, setExpanded] = useState(false), [map, setMap] = useState<LeafletMap | null>(null);
  const [focusStation, setFocusStation] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchGroup = useRef<HTMLDivElement>(null), searchButton = useRef<HTMLButtonElement>(null);
  const toolTrigger = useRef<HTMLButtonElement>(null);
  const [streets, setStreets] = useState(true), [pins, setPins] = useState(true), [counts, setCounts] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const toolsRef = useRef<HTMLDivElement>(null), searchRef = useRef<HTMLInputElement>(null);
  const buttons = useRef<Partial<Record<Tool, HTMLButtonElement | null>>>({});
  const stationCode = params.get('station'), severity = params.get('severity') || '';
  const severityQueries = useQueries({ queries: stations.map(station => {
    const filter = new URLSearchParams({ station: station.code, active: 'true', severity, limit: '1' }).toString();
    return { queryKey: ['alerts', filter], queryFn: () => api<{ total: number }>('/alerts?' + filter),
      enabled: !!severity, refetchInterval: 5000 };
  }) });
  const registryFailed = !online || registry.isError || registry.isPaused;
  const disconnected = snapshotQueries.map(query => registryFailed || query.isError || query.isPaused);
  const snapshots = snapshotQueries.map((query, i) => disconnected[i] ? undefined : query.data);
  const shown = stations.map((station, i) => ({ station, i })).filter(({ station, i }) =>
    matchesStation(station, snapshotStatus(snapshots[i], disconnected[i]), params) &&
    (!severity || (!severityQueries[i]?.isError && (severityQueries[i]?.data?.total || 0) > 0)));
  const selectedIndex = stations.findIndex(station => station.code === stationCode);
  const selected = stations[selectedIndex];
  const failure = registryFailed || disconnected.some(Boolean) || (!!severity && severityQueries.some(q => q.isError || q.isPaused));
  const pending = registry.isLoading || (!!severity && severityQueries.some(q => q.isLoading));
  const latest = snapshotQueries.map(q => q.data?.last_frame_at || '').sort().at(-1);
  const activeFilters = filterKeys.filter(key => params.get(key)).length;
  const lang = i18n.language === 'vi' ? 'vi' : 'en';

  function change(values: Record<string, string | null>, replace = false) {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, val]) => val ? next.set(key, val) : next.delete(key));
    setParams(next, { replace, preventScrollReset: true });
  }
  function showStation(code: string) {
    setFocusStation(code);
    change({ station: code, search: null, q: null });
    setSearchOpen(false);
    setTool(null);
    setExpanded(false);
  }
  function closeStation() {
    setFocusStation(null);
    change({ station: null });
    toolTrigger.current?.focus({ preventScroll: true });
  }
  function closeTool() {
    const previous = tool;
    setTool(null);
    requestAnimationFrame(() => { if (previous) buttons.current[previous]?.focus(); });
  }
  function retry() {
    void registry.refetch();
    snapshotQueries.forEach(q => void q.refetch());
    if (severity) severityQueries.forEach(q => void q.refetch());
  }
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update); window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  useEffect(() => {
    if (new URLSearchParams(location.search).has('search')) {
      setSearchOpen(true);
      setExpanded(false);
      setTool(null);
    }
  }, [location.key]);
  useEffect(() => {
    if (!expanded) return;
    if (tool) toolsRef.current?.querySelector<HTMLButtonElement>('.map-pop-head button')?.focus();
    const outside = (event: PointerEvent) => {
      if (!toolsRef.current?.contains(event.target as Node)) { setExpanded(false); setTool(null); }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setExpanded(false); setTool(null); toolTrigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [expanded, tool]);
  useEffect(() => {
    if (!searchOpen) return;
    searchRef.current?.focus();
    const dismiss = (event: PointerEvent) => {
      if (!searchGroup.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        searchButton.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, [searchOpen]);
  function openSearch() {
    setExpanded(false);
    setTool(null);
    setSearchOpen(true);
  }
  const tools = [
    { id: 'filters', name: t('filters'), Icon: Filter },
    { id: 'layers', name: label('layers'), Icon: Layers },
    { id: 'legend', name: label('legend'), Icon: BookOpen }
  ] as const;
  const reset = () => change({ q: null, river: null, status: null, channel: null, severity: null, station: null }, true);
  return <div className="map-home">

    <div className={'map-arena' + (selected ? ' has-station' : '')}>
      <div className="map-stage">
        <StationMap stations={shown.map(s => s.station)} states={shown.map(s => snapshots[s.i])} network={stations}
          selected={selected?.code} onSelect={showStation} onMap={setMap} streets={streets} markers={pins} counts={counts}/>
        <div className="map-readout">
          <h1>{label('title')}</h1>
          <span>{registry.data ? shown.length + ' / ' + stations.length + ' ' + label('matching') : t('loading')}</span>
          {latest && <span className="map-fresh">{label('updated')} <time dateTime={latest} title={formatTime(latest, i18n.language)}>{formatShortTime(latest, i18n.language)} ICT</time></span>}
          <div className="map-provenance" role="note"><details>
            <summary><FlaskConical size={13} aria-hidden="true"/>{t('source')}</summary>
            <p>{demoMode ? t('demoExplanation') : t('banner')}</p>
          </details></div>
        </div>
        {demoMode && <div className="demo-map-flag"><FlaskConical size={14} aria-hidden="true"/>{t('demoIndicator')}</div>}
        <div className="map-list-control" ref={searchGroup}>
          <IconButton ref={searchButton} className="station-search-trigger" aria-label={t('stationSearch')} title={label('list')}
            aria-controls="station-search-panel" aria-expanded={searchOpen} onClick={() => searchOpen ? setSearchOpen(false) : openSearch()}>
            {searchOpen ? <X size={21}/> : <List size={21}/>}
          </IconButton>
          <Cascade open={searchOpen} className="station-search-cascade">
            <section id="station-search-panel" className="floating-list station-search-panel" aria-label={label('list')}>
              <label className="map-search"><Search size={17} aria-hidden="true"/>
                <input ref={searchRef} type="search" aria-label={label('search')} placeholder={label('search')}
                  value={params.get('q') || ''} onChange={e => change({ q: e.target.value, search: null }, true)}/></label>
              {shown.length ? <ul className="map-results">{shown.map(({station, i}) => <li key={station.code}>
                <button aria-pressed={station.code === stationCode} onClick={() => showStation(station.code)}>
                  <span><strong>{text(station.name)}</strong><StationLifecycle lifecycle={station.lifecycle}/><small>{station.code} · {station.river}</small>
                    <small>{station.location.lat.toFixed(3)}° N · {station.location.lng.toFixed(3)}° E</small></span>
                  <span className="station-result-meta"><StatusBadge status={snapshotStatus(snapshots[i], disconnected[i])}/>
                    <Source state={snapshots[i]}/>
                    {snapshots[i]?.last_frame_at && <small><time dateTime={snapshots[i]!.last_frame_at!} title={formatTime(snapshots[i]!.last_frame_at, i18n.language)}>{formatShortTime(snapshots[i]!.last_frame_at!, i18n.language)} ICT</time></small>}
                  </span>
                </button></li>)}</ul> : <p>{pending ? t('loading') : failure ? t('error') : label('noMatch')}</p>}
            </section>
          </Cascade>
        </div>
        <div className="map-tools" ref={toolsRef}>
          <IconButton ref={toolTrigger} className="map-tools-trigger" aria-label={label('tools')} title={label('tools')}
            aria-controls={tool ? 'map-tool-panel' : 'map-tool-choices'} aria-expanded={expanded} onClick={() => { setExpanded(!expanded); setTool(null); setSearchOpen(false); }}>
            {expanded ? <X size={21}/> : <SlidersHorizontal size={21}/>}
          </IconButton>
          <Cascade open={expanded && !tool} className="map-tools-cascade">
            <div id="map-tool-choices" className="floating-list">
              <button className="cascade-item" style={stagger(0, tools.length + 1)} disabled={!map || !stations.length}
                onClick={() => { if (map) fitStations(map, stations); }}><LocateFixed size={18}/><span>{label('fit')}</span></button>
              {tools.map(({id, name, Icon}, index) => <button key={id} className="cascade-item" style={stagger(index + 1, tools.length + 1)}
                ref={node => { buttons.current[id] = node; }} onClick={() => setTool(id)}><Icon size={18}/><span>{name}</span>
                {id === 'filters' && activeFilters > 0 && <b>{activeFilters}</b>}</button>)}
            </div>
          </Cascade>
          {expanded && tool && <section className="map-tool-panel" id="map-tool-panel" aria-label={tools.find(x => x.id === tool)?.name}>
            <div className="map-pop-head"><h2>{tools.find(x => x.id === tool)?.name}</h2>
              <IconButton aria-label={label('backTools')} onClick={closeTool}><ArrowLeft size={17}/></IconButton></div>
            {tool === 'filters' && <div className="map-fields">{[
              { key: 'river', name: label('river'), choices: [...new Set(stations.map(s => s.river))].map(v => [v, v]) },
              { key: 'status', name: t('status'), choices: Object.entries(visuals.statuses).map(([k, s]) => [k, s.label[lang]]) },
              { key: 'channel', name: label('quant'), choices: [...new Set(stations.flatMap(s => s.sensors?.map(x => x.channel) || []))].map(v => [v, text(sensorType(v)?.label)]) },
              { key: 'severity', name: label('active') + ' · ' + t('severity'), choices: ['info', 'warning', 'critical'].map(v => [v, label(v as 'info' | 'warning' | 'critical')]) }
            ].map(f => <label key={f.key}>{f.name}<select value={params.get(f.key) || ''} onChange={e => change({ [f.key]: e.target.value, station: null })}>
              <option value="">{t('all')}</option>{f.choices.map(([v, name]) => <option key={v} value={v}>{name}</option>)}</select></label>)}
              <button className="map-reset" onClick={reset}>{label('reset')}</button></div>}
            {tool === 'layers' && <div className="map-layer-list">{[
              { name: label('streets'), value: streets, update: setStreets },
              { name: label('markers'), value: pins, update: setPins },
              { name: label('counts'), value: counts, update: setCounts }
            ].map(layer => <label key={layer.name}><input type="checkbox" checked={layer.value} onChange={e => layer.update(e.target.checked)}/>{layer.name}</label>)}</div>}
            {tool === 'legend' && <ul className="map-key">{(Object.keys(visuals.statuses) as Status[]).map(status =>
              <li key={status}><span aria-hidden="true" className={'key-symbol pin-' + status}><span className="pin-glyph"/></span><StatusBadge status={status}/></li>)}
              <li><strong className="sim-symbol">S</strong>{t('source')}</li></ul>}
          </section>}
        </div>
        <div className="map-zoom-stack" role="group" aria-label={label('stationMap')}>
          <IconButton aria-label={label('zoomIn')} title={label('zoomIn')} disabled={!map} onClick={() => map?.zoomIn()}><Plus size={21}/></IconButton>
          <IconButton aria-label={label('zoomOut')} title={label('zoomOut')} disabled={!map} onClick={() => map?.zoomOut()}><Minus size={21}/></IconButton>
        </div>
        {(failure || pending || !shown.length || (stationCode && !selected)) && <div className="map-message" role="status">
          {failure ? <>{label('stale')} <button onClick={retry}>{label('retry')}</button></> : pending ? t('loading')
            : stationCode && !selected ? <>{label('missing')} <button onClick={closeStation}>{label('close')}</button></>
            : activeFilters ? <>{label('noMatch')} <button onClick={reset}>{label('reset')}</button></> : label('noStations')}
        </div>}
      </div>
      {selected && <Inspector key={selected.code} station={selected} state={snapshotQueries[selectedIndex]?.data}
        disconnected={disconnected[selectedIndex]} loading={snapshotQueries[selectedIndex].isLoading} close={closeStation}
        channel={params.get('channel')} retry={retry} focusOnMount={focusStation === selected.code}/>}
    </div>
  </div>;
}
