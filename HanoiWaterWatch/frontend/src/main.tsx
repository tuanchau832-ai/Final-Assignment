import { lazy, Suspense, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FlaskConical } from 'lucide-react';
import { useOnline, useResource, useUser } from './api';
import WorkspaceHeader, { WorkspaceDock } from './WorkspaceHeader';
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
const Admin = lazy(() => import('./AdminPage'));
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

function LegacyRedirect({ section }: { section: 'map' | 'station' | 'alerts' }) {
  const { code, id } = useParams(), { search, hash } = useLocation();
  if (section === 'alerts') return <Navigate replace to={'/overview/alerts' + (id ? '/' + encodeURIComponent(id) : '') + search + hash}/>;
  if (section === 'station') return <Navigate replace to={'/stations/' + encodeURIComponent(code!) + '/dashboard' + search + hash}/>;
  const station = new URLSearchParams(search).get('station');
  return <Navigate replace to={'/map' + (station ? '?station=' + encodeURIComponent(station) : '')}/>;
}

function AdminRoute() {
  const session = useUser(), { t } = useTranslation();
  if (session.isPending) return <Loading/>;
  if (session.isError) return <section className="workspace-error" role="alert">
    {t('error')} <button onClick={() => void session.refetch()}>{t('retry')}</button>
  </section>;
  if (!session.data) return <Navigate replace to="/login?returnTo=%2Fadmin"/>;
  if (session.data.user.role !== 'admin') return <Navigate replace to="/overview"/>;
  return <Admin key={session.data.user.username}/>;
}

function Workspace() {
  const { t } = useTranslation(), location = useLocation();
  const online = useOnline(), health = useResource<{status: string}>('health', '/health', 5000);
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
  return <div className={'workspace-view' + (isMap ? ' map-workspace' : '')}>
    <a href="#main" className="skip">{t('skipToContent')}</a>
    <WorkspaceHeader floating={isMap} health={!online || health.isError ? 'disconnected' : health.isPending ? 'connecting' : 'apiConnected'}/>
    {!isMap && <div className={demoMode ? "provenance-strip demo-provenance" : "provenance-strip"} role="note"><FlaskConical size={15} aria-hidden="true"/><p>{demoMode ? <><strong className="demo-indicator">{t('demoIndicator')}</strong> {t('demoExplanation')}</> : t('banner')}</p></div>}
    {!isMap && (!online || health.isError) && <div className="workspace-error" role="alert">{t('error')} <button onClick={() => void health.refetch()}>{t('retry')}</button></div>}
    <main id="main" tabIndex={-1} ref={main} className={isMap ? 'map-main' : 'content-main'}>
      <Suspense fallback={<Loading/>}><Routes>
        <Route path="/map" element={<MapHome/>}/>
        <Route path="/overview" element={<Overview/>}/>
        <Route path="/overview/alerts" element={<Overview alertsFirst/>}/>
        <Route path="/overview/alerts/:id" element={<Overview alertsFirst/>}/>
        <Route path="/admin" element={<AdminRoute/>}/>
        <Route path="/stations" element={<LegacyRedirect section="map"/>}/>
        <Route path="/stations/:code" element={<LegacyRedirect section="station"/>}/>
        <Route path="/stations/:code/model" element={<Model/>}/>
        <Route path="/stations/:code/dashboard" element={<Dashboard/>}/>
        <Route path="/alerts" element={<LegacyRedirect section="alerts"/>}/>
        <Route path="/alerts/:id" element={<LegacyRedirect section="alerts"/>}/>
        <Route path="/simulation" element={<LegacyRedirect section="map"/>}/>
        <Route path="*" element={<section className="panel detail-body"><h1>{t('notFound')}</h1><Link to="/map">{t('mapHome')}</Link></section>}/>
      </Routes></Suspense>
    </main>
    {!isMap && <footer>{t('simFooter')}<span>API v1 · Registry v1</span></footer>}
    <WorkspaceDock/>
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
