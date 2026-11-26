import { lazy, Suspense, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FlaskConical } from 'lucide-react';
import { useAlerts, useOnline, useResource, useUser } from './api';
import { AlertNotification } from './AlertNotification';
import WorkspaceHeader from './WorkspaceHeader';
import { demoMode } from './features';
import './i18n';
import './styles.css';
import './workspace.css';
import './floating.css';
import './theme.css';

const MapHome = lazy(() => import('./MapHome'));
const Overview = lazy(() => import('./OverviewPage'));
const Login = lazy(() => import('./LoginPage'));
const Model = lazy(() => import('./ModelPage'));
const Dashboard = lazy(() => import('./DashboardPage'));
const Alerts = lazy(() => import('./AlertsPage'));
const Simulation = lazy(() => import('./SimulationPage'));
const client = new QueryClient({ defaultOptions: { queries: { staleTime: 1500, retry: 1 } } });

function Loading() {
  const { t } = useTranslation();
  return <p className="skeleton" role="status">{t('loading')}</p>;
}

function Entry() {
  const user = useUser();
  if (user.isPending) return <Loading/>;
  return <Navigate replace to={user.data ? '/map' : '/login'}/>;
}

function StationRedirect() {
  const { code } = useParams(), { search } = useLocation();
  return <Navigate replace to={'/stations/' + encodeURIComponent(code || '') + '/dashboard' + search}/>;
}

function Workspace() {
  const { t } = useTranslation(), location = useLocation();
  const user = useUser(), online = useOnline(), health = useResource<{status: string}>('health', '/health', 5000);
  const alerts = useAlerts('review_status=open&limit=5');
  const main = useRef<HTMLElement>(null), previous = useRef(location.pathname);
  const isMap = location.pathname.replace(/\/+$/, '').toLowerCase() === '/map';
  useEffect(() => {
    if (previous.current !== location.pathname) {
      const mapContext = new URLSearchParams(location.search);
      if (!(isMap && mapContext.has('search'))) {
        main.current?.focus({ preventScroll: true });
      }
      window.scrollTo(0, 0);
      previous.current = location.pathname;
    }
  }, [isMap, location.pathname, location.search]);
  useEffect(() => {
    document.title = (user.data && alerts.data?.total ? '(' + alerts.data.total + ') ' : '') + 'Hanoi WaterWatch';
    return () => { document.title = 'Hanoi WaterWatch'; };
  }, [user.data, alerts.data?.total]);
  return <div className={'workspace-view' + (isMap ? ' map-workspace' : '')}>
    <a href="#main" className="skip">{t('skipToContent')}</a>
    <WorkspaceHeader floating={isMap} health={!online || health.isError ? 'disconnected' : health.isPending ? 'connecting' : 'apiConnected'}
      alerts={alerts.data?.items} pending={alerts.isPending} alertError={!online || alerts.isError} retryAlerts={() => void alerts.refetch()}/>
    {!isMap && <div className={demoMode ? "provenance-strip demo-provenance" : "provenance-strip"} role="note"><FlaskConical size={15} aria-hidden="true"/><p>{demoMode ? <><strong className="demo-indicator">{t('demoIndicator')}</strong> {t('demoExplanation')}</> : t('banner')}</p></div>}
    {!isMap && (!online || health.isError) && <div className="workspace-error" role="alert">{t('error')} <button onClick={() => void health.refetch()}>{t('retry')}</button></div>}
    <main id="main" tabIndex={-1} ref={main} className={isMap ? 'map-main' : 'content-main'}>
      <Suspense fallback={<Loading/>}><Routes>
        <Route path="/map" element={<MapHome/>}/>
        <Route path="/overview" element={<Overview/>}/>
        <Route path="/stations/:code" element={<StationRedirect/>}/>
        <Route path="/stations/:code/model" element={<Model/>}/>
        <Route path="/stations/:code/dashboard" element={<Dashboard/>}/>
        <Route path="/alerts" element={<Alerts/>}/>
        <Route path="/alerts/:id" element={<Alerts/>}/>
        <Route path="/simulation" element={<Simulation/>}/>
        <Route path="*" element={<section className="panel detail-body"><h1>{t('notFound')}</h1><Link to="/map">{t('mapHome')}</Link></section>}/>
      </Routes></Suspense>
    </main>
    {!isMap && <footer>{t('simFooter')}<span>API v1 · Registry v1</span></footer>}
    {user.data && <AlertNotification key={user.data.user.username} alerts={alerts.data?.items}/>}
  </div>;
}
function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    localStorage.setItem('hww-language', i18n.language);
  }, [i18n.language]);
  return <Suspense fallback={<Loading/>}><Routes>
    <Route path="/" element={<Entry/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="*" element={<Workspace/>}/>
  </Routes></Suspense>;
}
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={client}><BrowserRouter><App/></BrowserRouter></QueryClientProvider>
);
