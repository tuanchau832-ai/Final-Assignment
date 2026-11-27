import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Droplets, Search, UserRound, Globe, LogOut, LogIn } from 'lucide-react';
import { useAction, useUser } from './api';
import { WorkspaceNotifications } from './AlertNotification';
import { Cascade, IconButton } from './FloatingControls';
import { demoMode } from './features';
import { destinations } from './navigation';
import NavArt from './NavArt';

const destinationsForEveryone = ['mapHome', 'overview', 'model', 'dashboard'] as const;

export function WorkspaceDock() {
  const { t } = useTranslation(), location = useLocation(), session = useUser();
  const paths = destinations(location.pathname, location.search);
  const items: (keyof typeof paths)[] = [...destinationsForEveryone];
  if (session.isSuccess && session.data?.user.role === 'admin') items.push('admin');
  return <div className="dest-dock"><nav className="dock-destinations" aria-label={t('workspaceNavigation')}>
    {items.map(key => <NavLink key={key} to={paths[key]} className="dest-link" aria-label={t(key)} title={t(key)}>
      <NavArt kind={key}/><span>{t(key)}</span>
    </NavLink>)}
  </nav></div>;
}

export default function WorkspaceHeader({ health, floating }: { health: string; floating: boolean }) {
  const { t, i18n } = useTranslation();
  const location = useLocation(), navigate = useNavigate(), user = useUser(), action = useAction();
  const [open, setOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const paths = destinations(location.pathname, location.search);
  useEffect(() => { setOpen(false); }, [location.key]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: Event) => { if (!group.current?.contains(e.target as Node)) setOpen(false); };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return <header className={floating ? 'map-chrome' : 'workspace-header'}>
    <div className="brand-group"><div className="workspace-brand">
      <span className="watermark"><Droplets size={24} aria-hidden="true"/></span>
      <span className="brand-wordmark">Hanoi<strong>WaterWatch</strong></span>
    </div></div>
    <div className="header-tools">
      {!floating && !demoMode && <span className={'health-light ' + health}>{t(health)}</span>}
      {!floating && <Link className="floating-icon station-search-shortcut" aria-label={t('stationSearch')} title={t('stationSearch')} to={paths.mapHome + (paths.mapHome.includes('?') ? '&' : '?') + 'search=1'}><Search size={21}/></Link>}
      <WorkspaceNotifications sessionPending={user.isPending} key={user.data?.user.username ?? 'guest'} username={user.isSuccess ? user.data?.user.username : undefined}/>
      <div className="account-group" ref={group}>
        <IconButton className="account-trigger" ref={trigger} aria-label={t('account')} title={t('account')} aria-expanded={open} aria-controls="account-actions"
          onClick={() => setOpen(!open)}><UserRound size={20}/></IconButton>
        <Cascade open={open} className="header-cascade account-menu">
          <div id="account-actions" className="floating-list">
            {user.data && <h2>{demoMode ? t('demoProfile') + ' · ' + user.data.user.role : user.data.user.display_name}</h2>}
            <button onClick={() => void i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}><Globe size={17}/>{i18n.language === 'vi' ? 'English' : 'Tiếng Việt'}</button>
            {user.data ? <button disabled={action.isPending} onClick={() => action.mutate({ path:'/auth/logout', body:{} }, { onSuccess:() => navigate('/login', { replace:true }) })}><LogOut size={17}/>{t('logout')}</button> :
              <Link to={'/login?returnTo=' + encodeURIComponent(location.pathname + location.search)}><LogIn size={17}/>{t('login')}</Link>}
            {action.isError && <p role="alert">{t('error')}</p>}
          </div>
        </Cascade>
      </div>
    </div>
  </header>;
}
