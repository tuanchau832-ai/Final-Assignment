import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api, ApiError, useOnline, useUser } from './api';
import { HistoryChart } from './DashboardPage';
import { QueryState, useText } from './common';
import { formatTime } from './domain';
import { demoMode } from './features';
import type { Station } from './types';
import sensors from '../../shared/registry/sensor_types.json';
import './admin.css';

type Audit = { id: number; at: string; actor: string; action: string; station?: string;
  reason?: string; before?: string; after?: string; audience?: string; recipient_count?: number };
type Statistic = { station: string; lifecycle: string; samples: number; valid: number; minimum: number | null;
  maximum: number | null; mean: number | null; first_value: number | null; last_value: number | null;
  received_frames: number; expected_frames: number; maintenance_seconds: number; coverage_pct: number | null;
  episodes: number; sources: string[] };
type Stats = {from: string; to: string; channel: string; unit: string; items: Statistic[]};
type Preview = {path: string; title: string; detail: string; body: Record<string, unknown>};
type Label = (en: string, vi: string) => string;

function localTime(instant: number) {
  return new Date(instant + 7 * 3600000).toISOString().slice(0, 16);
}

function StatsPanel({ stations, actor, label }: {stations: Station[]; actor: string; label: Label}) {
  const [selected, setSelected] = useState('');
  const [compare, setCompare] = useState('');
  const [channel, setChannel] = useState('ph');
  const [from, setFrom] = useState(() => localTime(Date.now() - 24 * 3600000));
  const [to, setTo] = useState(() => localTime(Date.now()));
  const station = selected || stations[0]?.code || '';
  const online = useOnline();
  const sensor = stations.find(item => item.code === station)?.sensors?.find(item => item.channel === channel);
  const start = Date.parse(from + '+07:00'), end = Date.parse(to + '+07:00');
  const valid = Number.isFinite(start) && end > start && end - start <= 7 * 86400000;
  const params = new URLSearchParams({station, channel});
  if (valid) { params.set('from', new Date(start).toISOString()); params.set('to', new Date(end).toISOString()); }
  if (compare && compare !== station) params.set('compare', compare);
  const stats = useQuery({queryKey: ['admin', actor, 'statistics', params.toString()],
    queryFn: () => api<Stats>('/admin/statistics?' + params), enabled: valid && !!station, gcTime: 0, retry: false});
  const text = useText();
  const options = stations.map(s => <option key={s.code}>{s.code}</option>);
  const format = (value: number | null) => value == null ? '—' : value.toLocaleString(undefined, {maximumFractionDigits: 2});
  return <section className="admin-section"><h2>{label('Monitoring statistics', 'Thống kê giám sát')}</h2>
    <div className="admin-fields">
      <label>{label('Station', 'Trạm')}<select value={station} onChange={e => setSelected(e.target.value)}>{options}</select></label>
      <label>{label('Compare station', 'Trạm so sánh')}<select value={compare === station ? '' : compare} onChange={e => setCompare(e.target.value)}>
        <option value="">{label('None', 'Không')}</option>{options.filter(o => o.key !== station)}</select></label>
      <label>{label('Sensor', 'Cảm biến')}<select value={channel} onChange={e => setChannel(e.target.value)}>
        {Object.entries(sensors.types).map(([code, spec]) => <option key={code} value={code}>{text(spec.label)}</option>)}</select></label>
      <label>{label('From (UTC+7)', 'Từ (UTC+7)')}<input type="datetime-local" value={from} onChange={e => setFrom(e.target.value)}/></label>
      <label>{label('To (UTC+7)', 'Đến (UTC+7)')}<input type="datetime-local" value={to} onChange={e => setTo(e.target.value)}/></label>
    </div>
    {!valid && <p role="alert">{label('Choose a period of up to seven days.', 'Chọn khoảng thời gian tối đa bảy ngày.')}</p>}
    {station && valid && <QueryState loading={stats.isPending} error={stats.error}/>}
    {stats.isSuccess && valid && sensor && <HistoryChart key={station + channel + compare + from + to}
      sensor={sensor} code={station} compare={params.get('compare') || undefined}
      window={{from: stats.data.from, to: stats.data.to}} disconnected={!online}/>}
    {stats.isSuccess && stats.data.items.map(row => {
      const chart = new URLSearchParams({range: 'custom', sensor: channel, from, to});
      if (compare && compare !== station && row.station === station) chart.set('compare', compare);
      const alerts = new URLSearchParams({station: row.station, channel, category: 'water_quality',
        from: stats.data.from, to: stats.data.to});
      return <article key={row.station} className="admin-measures"><h3>{row.station} · {stats.data.unit}</h3>
        <dl>
          <div><dt>{label('Valid / received samples', 'Mẫu hợp lệ / đã nhận')}</dt><dd>{row.valid} / {row.samples}</dd></div>
          <div><dt>{label('Minimum / mean / maximum', 'Thấp nhất / trung bình / cao nhất')}</dt><dd>{[row.minimum, row.mean, row.maximum].map(format).join(' / ')}</dd></div>
          <div><dt>{label('First → last valid reading', 'Số đo hợp lệ đầu → cuối')}</dt><dd>{format(row.first_value)} → {format(row.last_value)}</dd></div>
          <div><dt>{label('Frames received / expected', 'Khung đã nhận / dự kiến')}</dt><dd>{row.received_frames} / {row.expected_frames} ({row.coverage_pct == null ? '—' : format(row.coverage_pct) + '%'})</dd></div>
          <div><dt>{label('Maintenance excluded (s)', 'Thời gian bảo trì đã loại (giây)')}</dt><dd>{format(row.maintenance_seconds)}</dd></div>
          <div><dt>{label('Data source', 'Nguồn dữ liệu')}</dt><dd>{row.sources.join(', ') || label('No samples', 'Không có mẫu')}</dd></div>
        </dl>
        <Link to={'/stations/' + row.station + '/dashboard?' + chart}>{label('Explore trend chart', 'Xem biểu đồ xu hướng')}</Link>
        <Link to={'/overview/alerts?' + alerts}>{label('Water-quality episodes', 'Các đợt cảnh báo chất lượng nước')} ({row.episodes})</Link>
      </article>;
    })}</section>;
}

function Management({ actor }: {actor: string}) {
  const { i18n } = useTranslation(), client = useQueryClient(), text = useText();
  const label: Label = (en, vi) => i18n.language.startsWith('vi') ? vi : en;
  const [selection, setSelection] = useState('');
  const [preview, setPreview] = useState<Preview>();
  const [outcome, setOutcome] = useState('');
  const list = useQuery({queryKey: ['admin', actor, 'stations'], queryFn: () => api<{items: Station[]}>('/admin/stations'), gcTime: 0, retry: false});
  const audit = useQuery({queryKey: ['admin', actor, 'audit'], queryFn: () => api<{items: Audit[]}>('/admin/audit'), gcTime: 0, retry: false});
  const mutation = useMutation({mutationFn: (request: Preview) => api<{recipient_count?: number}>(request.path, request.body),
    onSuccess: (data) => {
      setOutcome(data.recipient_count === undefined ? label('Station updated.', 'Đã cập nhật trạm.') :
        label('Authorized recipients', 'Số người nhận đủ điều kiện') + ': ' + data.recipient_count);
      setPreview(undefined); void client.invalidateQueries();
    },
    onError: () => { void client.invalidateQueries({queryKey: ['user']}); }
  });
  const stations = list.data?.items || [], selected = stations.find(s => s.code === selection) || stations[0];
  const status = (value?: string) => value === 'active' ? label('Active', 'Hoạt động') : value === 'maintenance'
    ? label('Maintenance', 'Bảo trì') : value === 'archived' ? label('Archived', 'Đã lưu trữ') : '—';
  const audiences = {all: label('All authorized staff', 'Tất cả nhân viên đủ quyền'), operator: label('Operators', 'Vận hành'),
    reviewer: label('Reviewers', 'Đánh giá viên'), admin: label('Administrators', 'Quản trị viên')};
  function prepare(path: string, title: string, detail: string, body: Record<string, unknown>) {
    mutation.reset(); setOutcome('');
    setPreview({path, title, detail, body: {...body, confirmed: true, request_id: crypto.randomUUID()}});
  }
  function formValues(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); return Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
  }
  const error = list.error || audit.error || mutation.error;
  if (error instanceof ApiError && [401, 403].includes(error.status))
    return <p role="alert">{label('Administrator access required.', 'Cần quyền quản trị viên.')}</p>;
  return <div className="admin-page"><div className="page-title"><h1>{label('Administration', 'Quản trị')}</h1></div>
    {preview && <section className="admin-confirm" aria-label={label('Confirm action', 'Xác nhận thao tác')}>
      <h2>{preview.title}</h2><p>{preview.detail}</p>
      <button className="button" disabled={mutation.isPending} onClick={() => mutation.mutate(preview)} autoFocus>{label('Confirm', 'Xác nhận')}</button>
      <button className="button" disabled={mutation.isPending} onClick={() => { setPreview(undefined); mutation.reset(); }}>{label('Cancel', 'Hủy')}</button>
      {mutation.error && <p role="alert">{mutation.error.message}</p>}
    </section>}
    {outcome && <p role="status">{outcome}</p>}
    <fieldset className="admin-workflows" disabled={!!preview}><legend className="sr-only">{label('Station management', 'Quản lý trạm')}</legend>
    <section className="admin-section"><h2>{label('Stations', 'Trạm')}</h2><QueryState loading={list.isPending} error={list.error}/>
      {selected && <form key={selected.code + selected.lifecycle} onSubmit={e => {
        const values = formValues(e), target = values.lifecycle;
        const detail = [selected.code, status(selected.lifecycle) + ' → ' + status(target), values.reason,
          target === 'archived' ? label('History stays available. Archival is permanent.', 'Lịch sử được lưu giữ. Không thể hủy lưu trữ.') : ''].filter(Boolean).join(' · ');
        prepare('/admin/stations/' + selected.code + '/lifecycle', label('Change station lifecycle', 'Đổi trạng thái trạm'), detail,
          {...values, previous: selected.lifecycle});
      }}><div className="admin-fields">
        <label>{label('Manage station', 'Chọn trạm quản lý')}<select value={selected.code} onChange={e => setSelection(e.target.value)}>
          {stations.map(s => <option key={s.code} value={s.code}>{s.code} · {text(s.name)} · {status(s.lifecycle)}</option>)}</select></label>
        {selected.lifecycle !== 'archived' && <>
          <label>{label('New status', 'Trạng thái mới')}<select name="lifecycle">
            {selected.lifecycle === 'maintenance' ? <option value="active">{status('active')}</option> : <option value="maintenance">{status('maintenance')}</option>}
            <option value="archived">{status('archived')}</option></select></label>
          <label>{label('Reason for change', 'Lý do thay đổi')}<input name="reason" required maxLength={500}/></label>
        </>}</div>
        {selected.lifecycle !== 'archived' && <button className="button">{label('Review change', 'Xem lại thay đổi')}</button>}
      </form>}
      <details><summary>{label('Create station', 'Tạo trạm')}</summary><form onSubmit={e => {
        const values = formValues(e);
        prepare('/admin/stations', label('Create station', 'Tạo trạm'), [values.code, values.name_en, values.name_vi, values.river, values.lat, values.lng, values.data_mode, values.reason].join(' · '),
          {...values, lat: Number(values.lat), lng: Number(values.lng)});
      }}><div className="admin-fields">
        <label>{label('Station code', 'Mã trạm')}<input name="code" placeholder="HWW-ABC-001" required pattern="HWW-[A-Z]{3}-[0-9]{3}"/></label>
        {([['name_en', 'English name', 'Tên tiếng Anh'], ['name_vi', 'Vietnamese name', 'Tên tiếng Việt'], ['river', 'River', 'Sông']] as const).map(([key,en,vi]) =>
          <label key={key}>{label(en,vi)}<input name={key} required maxLength={120}/></label>)}
        <label>{label('Latitude', 'Vĩ độ')}<input type="number" name="lat" step="any" min={-90} max={90} required/></label>
        <label>{label('Longitude', 'Kinh độ')}<input type="number" name="lng" step="any" min={-180} max={180} required/></label>
        <label>{label('Configured source', 'Nguồn cấu hình')}<select name="data_mode">
          <option value="planned">{label('Planned · no source', 'Dự kiến · chưa có nguồn')}</option>
          <option value="replay">{label('Simulated replay', 'Phát lại mô phỏng')}</option></select></label>
        <label>{label('Reason for creation', 'Lý do tạo trạm')}<input name="reason" required maxLength={500}/></label>
      </div><button className="button">{label('Review new station', 'Xem lại trạm mới')}</button></form></details>
    </section>
    <section className="admin-section"><h2>{label('Announcements', 'Thông báo quản trị')}</h2><form onSubmit={e => {
      const values = formValues(e);
      prepare('/admin/announcements', label('Send announcement', 'Gửi thông báo'), audiences[values.audience as keyof typeof audiences] + ' · ' + values.message, values);
    }}><div className="admin-fields">
      <label>{label('Audience', 'Đối tượng nhận')}<select name="audience">{Object.entries(audiences).map(([key,value]) => <option key={key} value={key}>{value}</option>)}</select></label>
      <label>{label('Message', 'Nội dung')}<textarea name="message" required maxLength={1600}/></label>
    </div><button className="button">{label('Review announcement', 'Xem lại thông báo')}</button></form></section>
    </fieldset>
    <StatsPanel stations={stations} actor={actor} label={label}/>
    <section className="admin-section"><h2>{label('Recent audit history', 'Lịch sử quản trị gần đây')}</h2>
      <QueryState loading={audit.isPending} error={audit.error}/>
      {!audit.isPending && !audit.data?.items.length && !audit.isError && <p>{label('No actions recorded.', 'Chưa ghi nhận thao tác.')}</p>}
      <ul className="admin-audit">{audit.data?.items.map(row => <li key={row.id}>
        <strong>{row.station || label('Announcement', 'Thông báo quản trị')}</strong> · {row.actor} · {formatTime(row.at, i18n.language)}
        <p>{row.audience ? audiences[row.audience as keyof typeof audiences] + ' · ' + row.recipient_count :
          [status(row.before), '→', status(row.after), row.reason].filter(Boolean).join(' ')}</p>
      </li>)}</ul></section>
  </div>;
}

export default function AdminPage() {
  const user = useUser();
  if (user.data?.user.role !== 'admin') return null;
  return <Management actor={user.data.user.username} key={user.data.user.username + String(demoMode)}/>;
}
