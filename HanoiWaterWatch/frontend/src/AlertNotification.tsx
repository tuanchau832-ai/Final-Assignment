import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from './api';
import { Cascade, IconButton } from './FloatingControls';
import { formatTime } from './domain';

type Level = 'normal' | 'warning' | 'critical';
type Notice = { id: number; at: string } & (
  { type: 'announcement'; actor: string; message: string } |
  { type: 'water_quality'; station_code: string; previous: Level; condition: Level; alert_id: number; source: string }
);
type Feed = { account: string; items: Notice[]; has_more: boolean };

function NoticeContent({ item }: { item: Notice }) {
  const { t, i18n } = useTranslation();
  const level = (value: Level) => t(value === 'normal' ? 'normal' : 'severity_' + value);
  if (item.type === 'announcement') return <span><strong>{t('adminAnnouncement')}</strong>
    <span>{item.message}</span><small>{item.actor} · {formatTime(item.at, i18n.language)}</small></span>;
  return <span><strong>{item.station_code} · {level(item.previous)} → {level(item.condition)}</strong>
    <small>{t('conditionTransition')} · {t('notificationSource_' + item.source)} · {formatTime(item.at, i18n.language)}</small></span>;
}

function detailUrl(item: Extract<Notice, { type: 'water_quality' }>) {
  return '/overview/alerts/' + item.alert_id + '?station=' + encodeURIComponent(item.station_code);
}

export function WorkspaceNotifications({ username, sessionPending = false }: { username?: string; sessionPending?: boolean }) {
  const { t } = useTranslation(), location = useLocation(), client = useQueryClient();
  const [open, setOpen] = useState(false), [queue, setQueue] = useState<Notice[]>([]);
  const [denied, setDenied] = useState(false);
  const group = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const history = useQuery({
    queryKey: ['notifications', username],
    queryFn: () => api<Feed>('/notifications'),
    enabled: !!username && open && !denied, gcTime: 0, retry: false, refetchInterval: 5000,
  });
  useEffect(() => setOpen(false), [location.key]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => { if (!group.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
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
  useEffect(() => {
    if (!username) return;
    let active = true, timer: number;
    const key = 'hww-poll-window-' + username;
    let drainedThrough = -1;
    async function poll() {
      let delay = 5000;
      try {
        const stored = sessionStorage.getItem(key);
        let batch: { request_id: string; through_id: number };
        if (stored) batch = JSON.parse(stored);
        else {
          const latest = await api<Feed>('/notifications');
          if (!active || latest.account !== username) return;
          client.setQueryData(['notifications', username], latest);
          const through = latest.items[0]?.id ?? 0;
          if (through === drainedThrough) return;
          batch = { request_id: crypto.randomUUID(), through_id: through };
          sessionStorage.setItem(key, JSON.stringify(batch));
        }
        const feed = await api<Feed>('/notifications/poll', { account: username, ...batch });
        if (!active || feed.account !== username) return;
        sessionStorage.removeItem(key);
        setDenied(false);
        if (feed.items.length) {
          setQueue(current => [...current, ...feed.items.filter(item => !current.some(prior => prior.id === item.id))]);
          void client.invalidateQueries({ queryKey: ['notifications', username] });
        }
        if (feed.has_more) delay = 0;
        else drainedThrough = batch.through_id;
      } catch (error) {
        if (active && error instanceof ApiError && [401, 403].includes(error.status)) {
          setDenied(true);
          setQueue([]);
          client.removeQueries({ queryKey: ['notifications', username] });
          void client.invalidateQueries({ queryKey: ['user'] });
        }
      } finally {
        if (active) timer = window.setTimeout(poll, delay);
      }
    }
    void poll();
    return () => { active = false; window.clearTimeout(timer); };
  }, [username, client]);

  const items = !denied && history.data?.account === username ? history.data?.items : undefined;
  const toast = queue[0];
  const dismiss = () => setQueue(current => current.slice(1));
  return <div className="notification-group" ref={group}>
    <IconButton ref={trigger} disabled={sessionPending} aria-label={t('notifications')} title={t('notifications')} aria-expanded={open}
      aria-controls="notifications" onClick={() => setOpen(value => !value)}>
      <Bell size={21}/>{toast && <span className="notification-dot"/>}
    </IconButton>
    <Cascade open={open} className="header-cascade notification-menu">
      <section id="notifications" className="floating-list" aria-label={t('notifications')}>
        <h2>{t('notifications')}</h2>
        {!username || denied ? <p>{t('notificationSignIn')}</p>
          : history.isError ? <p>{t('error')} <button onClick={() => void history.refetch()}>{t('retry')}</button></p>
          : history.isPending ? <p>{t('loading')}</p>
          : items?.length ? <ul>{items.map(item => <li key={item.id}>
            {item.type === 'water_quality' ? <Link to={detailUrl(item)}><NoticeContent item={item}/></Link>
              : <div className="announcement-item"><NoticeContent item={item}/></div>}
          </li>)}</ul> : <p>{t('noNotifications')}</p>}
        <Link className="floating-list-footer" to="/overview/alerts?review_status=open">{t('allAlerts')}</Link>
      </section>
    </Cascade>
    {username && toast && !denied && !open && createPortal(<aside className="alert-notification" aria-label={t('notifications')}>
      <Bell size={18} aria-hidden="true"/>
      <div><div role="status"><NoticeContent item={toast}/></div>
        {toast.type === 'water_quality' && <Link className="textlink" to={detailUrl(toast)} onClick={dismiss}>{t('reviewAlertLink')}</Link>}
      </div>
      <button className="icon-button" aria-label={t('dismissNotification')} onClick={dismiss}><X size={16}/></button>
    </aside>, document.body)}
  </div>;
}
