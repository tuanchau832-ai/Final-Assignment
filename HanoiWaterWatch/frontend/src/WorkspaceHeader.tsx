import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Map, LayoutDashboard, Box, Activity, Bell, FlaskConical, ChevronDown, Droplets, Search, UserRound, Globe, LogOut, LogIn } from 'lucide-react';
import { useAction, useUser } from './api';
import { useText } from './common';
import { formatTime } from './domain';
import { Cascade, IconButton, stagger } from './FloatingControls';
import { demoMode } from './features';
import { destinations } from './navigation';
import type { Alert } from './types';

const items = [
  ['mapHome', Map], ['overview', LayoutDashboard], ['model', Box],
  ['dashboard', Activity], ['alerts', Bell], ['simulation', FlaskConical],
] as const;

export default function WorkspaceHeader({ health, floating, alerts, pending, alertError, retryAlerts }: {
  health: string; floating: boolean; alerts?: Alert[]; pending: boolean; alertError: boolean; retryAlerts: () => void
}) {
  const { t, i18n } = useTranslation(), text = useText();
  const location = useLocation(), navigate = useNavigate(), user = useUser(), action = useAction();
  const [open, setOpen] = useState<'nav' | 'account' | 'notifications' | null>(null);
  const [seen, setSeen] = useState(0);
  const navGroup = useRef<HTMLDivElement>(null), accountGroup = useRef<HTMLDivElement>(null), alertGroup = useRef<HTMLDivElement>(null);
  const navButton = useRef<HTMLButtonElement>(null), accountButton = useRef<HTMLButtonElement>(null), alertButton = useRef<HTMLButtonElement>(null);
  const paths = destinations(location.pathname, location.search);
  const newest = alerts?.reduce((latest, alert) => Math.max(latest, alert.id), 0) ?? 0;
  const notifications = i18n.language.startsWith('vi') ? 'Thông báo' : 'Notifications';
  const Surface = floating ? 'div' : 'header';
  useEffect(() => { setOpen(null); }, [location.key]);
  useEffect(() => { if (open === 'notifications') setSeen(current => Math.max(current, newest)); }, [open, newest]);
  useEffect(() => {
    if (!open) return;
    const { group, trigger } = {
      nav: { group: navGroup, trigger: navButton },
      account: { group: accountGroup, trigger: accountButton },
      notifications: { group: alertGroup, trigger: alertButton },
    }[open];
    const outside = (e: Event) => { if (!group.current?.contains(e.target as Node)) setOpen(null); };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(null); trigger.current?.focus(); }
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
  return <Surface className={floating ? 'map-chrome' : 'workspace-header'}>
    <div className="brand-group" ref={navGroup}>
      <button className="brand-trigger" ref={navButton} aria-label={'HanoiWaterWatch · ' + t('workspaceNavigation')} aria-expanded={open === 'nav'} aria-controls="destinations"
        onClick={() => setOpen(open === 'nav' ? null : 'nav')}>
        <span className="watermark"><Droplets size={24} aria-hidden="true"/></span>
        <span className="brand-wordmark">Hanoi<strong>WaterWatch</strong></span><ChevronDown className="brand-chevron" size={15} aria-hidden="true"/>
      </button>
      <Cascade open={open === 'nav'} className="header-cascade destination-menu">
        <nav id="destinations" aria-label={t('workspace')} className="floating-list">
          {items.map(([key, Icon], index) => <NavLink className="cascade-item" style={stagger(index, items.length)} key={key} to={paths[key]} onClick={() => setOpen(null)}>
            <Icon size={19}/><span>{t(key)}</span>
          </NavLink>)}
        </nav>
      </Cascade>
    </div>
    <div className="header-tools">
      {!floating && !demoMode && <span className={'health-light ' + health}>{t(health)}</span>}
      {!floating && <Link className="floating-icon station-search-shortcut" aria-label={t('stationSearch')} title={t('stationSearch')} to={paths.mapHome + (paths.mapHome.includes('?') ? '&' : '?') + 'search=1'}><Search size={21}/></Link>}
      <div className="notification-group" ref={alertGroup}>
        <IconButton ref={alertButton} aria-label={notifications} title={notifications} aria-controls="notifications" aria-expanded={open === 'notifications'}
          onClick={() => setOpen(open === 'notifications' ? null : 'notifications')}>
          <Bell size={21}/>{!!user.data && newest > seen && <span className="notification-dot"/>}
        </IconButton>
        <Cascade open={open === 'notifications'} className="header-cascade notification-menu">
          <section id="notifications" className="floating-list" aria-label={notifications}>
            <h2>{notifications}</h2>
            {alertError ? <p>{t('error')} <button className="textlink" onClick={retryAlerts}>{t('retry')}</button></p>
              : pending ? <p>{t('loading')}</p>
              : alerts?.length ? <ul>{alerts.map(alert => <li key={alert.id}>
                  <Link to={'/alerts/' + alert.id}><span><strong>{text(alert.rule_name)}</strong><small>{alert.station_code} · {formatTime(alert.opened_at, i18n.language)}</small></span>
                    <small className={'notification-severity ' + alert.severity}>{alert.severity}</small></Link>
                </li>)}</ul> : <p>{t('noAlerts')}</p>}
            <Link className="floating-list-footer" to="/alerts?review_status=open">{t('allAlerts')}</Link>
          </section>
        </Cascade>
      </div>
      <div className="account-group" ref={accountGroup}>
        <IconButton className="account-trigger" ref={accountButton} aria-label={t('account')} title={t('account')} aria-expanded={open === 'account'} aria-controls="account-actions"
          onClick={() => setOpen(open === 'account' ? null : 'account')}><UserRound size={20}/></IconButton>
        <Cascade open={open === 'account'} className="header-cascade account-menu">
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
  </Surface>;
}
