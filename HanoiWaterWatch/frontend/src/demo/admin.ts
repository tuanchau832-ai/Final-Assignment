import { ApiError } from '../dataProvider';
import type { Station, User } from '../types';
import { channels, createDataset, stamp, types } from './dataset';

type Lifecycle = 'active' | 'maintenance' | 'archived';
type DemoStation = Station & { lifecycle: Lifecycle };
type Audit = {
  id: number; at: string; actor: string; action: string; station?: string;
  reason?: string; before?: Lifecycle; after?: Lifecycle; audience?: string; recipient_count?: number;
};
type Announcement = {
  id: number; type: 'announcement'; actor: string; at: string; message: string;
  account: string; is_simulated: true;
};

function fail(status: number, message: string): never {
  throw new ApiError(status, message);
}

function text(value: unknown, max: number) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    return fail(422, 'Enter a valid demonstration value.');
  }
  return value.trim();
}

function coordinate(value: unknown, max: number) {
  if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > max) {
    return fail(422, 'Enter valid demonstration coordinates.');
  }
  return value;
}

function requestId(value: unknown) {
  const id = text(value, 36);
  if (!/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id)) return fail(422, 'Invalid request ID.');
  return id;
}

export function demoAdmin(
  authorize: () => Promise<User | null>,
  initialStations: Station[],
  dataset: ReturnType<typeof createDataset>,
) {
  const stations: DemoStation[] = initialStations.map(station => ({...station, lifecycle:'active'}));
  const audit: Audit[] = [];
  const announcements: Announcement[] = [];
  const polls = new Map<string, {items: Announcement[]; has_more: boolean; account: string}>();
  const delivered = new Map<string, number>();
  const writes = new Map<string, { input: string; result: unknown }>();

  async function account(admin = false) {
    const user = await authorize();
    if (!user) return fail(401, 'Sign in to use this demonstration feature.');
    if (admin && user.role !== 'admin') return fail(403, 'Administrator access required.');
    return user;
  }

  function auditEntry(user: User, entry: Omit<Audit, 'id' | 'at' | 'actor'>) {
    audit.unshift({...entry, id:audit.length + 1, at:stamp(Date.now()), actor:user.username});
  }

  function station(code: string | null) {
    return stations.find(item => item.code === code) ?? fail(404, 'Demo station not found');
  }

  function statistics(query: URLSearchParams) {
    const channel = channels.find(value => value === query.get('channel'));
    const from = Date.parse(query.get('from') ?? '');
    const to = Date.parse(query.get('to') ?? '');
    if (!channel || !Number.isFinite(to - from) || to <= from || to - from > 7 * 86400000) {
      return fail(422, 'Select a sensor and a date range of at most seven days.');
    }
    const codes = [...new Set([query.get('station'), query.get('compare')].filter((code): code is string => !!code))];
    if (!codes.length) return fail(422, 'Select a station.');
    const items = codes.map(code => {
      const site = station(code);
      const seeded = initialStations.some(item => item.code === code);
      const availability = seeded ? dataset.availability(site.code, from, to) : null;
      let samples = 0, sum = 0;
      let minimum: number | null = null, maximum: number | null = null;
      let first: number | null = null, last: number | null = null;
      if (seeded) {
        for (let time = Math.ceil(from / 2000) * 2000; time < to && time <= dataset.anchor; time += 2000) {
          const value = dataset.sample(site.code, channel, time);
          if (value === null) continue;
          samples++;
          sum += value;
          first ??= value;
          last = value;
          minimum = minimum === null ? value : Math.min(minimum, value);
          maximum = maximum === null ? value : Math.max(maximum, value);
        }
      }
      const episodes = dataset.alerts.filter(alert => alert.station_code === code &&
        alert.sensor_uid === code + ':' + channel && Date.parse(alert.opened_at) >= from &&
        Date.parse(alert.opened_at) < to).length;
      let maintenance = 0, inactive = 0;
      let latest = to;
      for (const event of audit.filter(entry => entry.station === code && entry.action === 'station_lifecycle')) {
        const time = Date.parse(event.at);
        const start = Math.max(time, from);
        if (event.after === 'maintenance' && latest > start) maintenance += latest - start;
        if (event.after !== 'active' && latest > start) inactive += latest - start;
        latest = Math.min(time, latest);
      }
      const expected = availability && site.data_mode !== 'planned'
        ? Math.max(0, Math.floor((to - from - inactive) / 2000)) : 0;
      const received = availability?.received_frames ?? 0;
      return {station:site.code, lifecycle:site.lifecycle, samples, valid:samples,
        minimum, maximum, mean:samples ? sum / samples : null, first_value:first, last_value:last,
        received_frames:received, expected_frames:expected,
        coverage_pct:expected ? Math.min(100, 100 * received / expected) : null,
        maintenance_seconds:maintenance / 1000, episodes,
        sources:samples ? ['demo_dataset'] : []};
    });
    return {from:stamp(from), to:stamp(to), channel, unit:types[channel].unit, is_simulated:true, items};
  }

  async function read(resource: string, query: URLSearchParams) {
    if (resource === 'notifications') {
      const user = await account();
      const items = announcements.filter(item => item.account === user.username).reverse();
      return {items:items.slice(0, 50), has_more:items.length > 50, account:user.username};
    }
    await account(true);
    if (resource === 'stations') return {items:stations, is_simulated:true};
    if (resource === 'audit') return {items:audit, is_simulated:true};
    if (resource === 'statistics') return statistics(query);
    return fail(404, 'Unsupported demonstration resource');
  }

  async function mutate(resource: string, code: string | undefined, data: Record<string, unknown>) {
    const user = await account(resource !== 'notifications');
    const id = requestId(data.request_id);
    if (resource === 'notifications' && code === 'poll') {
      if (data.account !== user.username) return fail(403, 'The signed-in account has changed.');
      const key = user.username + ':' + id;
      const previous = polls.get(key);
      if (previous) return previous;
      const through = data.through_id === undefined ? Number.MAX_SAFE_INTEGER : data.through_id;
      if (typeof through !== 'number' || !Number.isSafeInteger(through) || through < 0) {
        return fail(422, 'Invalid notification boundary.');
      }
      const pending = announcements.filter(item => item.account === user.username &&
        item.id > (delivered.get(user.username) ?? 0) && item.id <= through);
      const items = pending.slice(0, 50);
      if (items.length) delivered.set(user.username, items[items.length - 1].id);
      const result = {items, has_more:pending.length > items.length, account:user.username};
      polls.set(key, result);
      return result;
    }

    if (data.confirmed !== true) return fail(422, 'Confirm this demonstration action.');
    const key = user.username + ':' + id;
    const input = JSON.stringify([resource, code, data]);
    const previous = writes.get(key);
    if (previous) {
      if (previous.input !== input) return fail(409, 'This request ID was already used.');
      return previous.result;
    }
    let result: unknown;
    if (resource === 'stations' && !code) {
      const stationCode = text(data.code, 48);
      if (!/^HWW-[A-Z]{3}-[0-9]{3}$/.test(stationCode)) return fail(422, 'Invalid station code.');
      if (stations.some(item => item.code === stationCode)) return fail(409, 'This station code already exists.');
      if (data.data_mode !== 'planned' && data.data_mode !== 'replay') return fail(422, 'Select a valid data mode.');
      const reason = text(data.reason, 500);
      const site: DemoStation = {code:stationCode, name:{en:text(data.name_en, 120), vi:text(data.name_vi, 120)},
        river:text(data.river, 120), location:{lat:coordinate(data.lat, 90), lng:coordinate(data.lng, 180)},
        lifecycle:'active', data_mode:data.data_mode, sensors:[]};
      stations.push(site);
      auditEntry(user, {action:'station_created', station:stationCode, reason, after:'active'});
      result = site;
    } else if (resource === 'stations' && code) {
      const site = station(code), before = site.lifecycle, after = data.lifecycle;
      if (after !== 'active' && after !== 'maintenance' && after !== 'archived') return fail(422, 'Select a valid lifecycle.');
      if (data.previous !== before || before === 'archived' || before === after) return fail(409, 'The station lifecycle has changed.');
      const reason = text(data.reason, 500);
      site.lifecycle = after;
      auditEntry(user, {action:'station_lifecycle', station:code, reason, before, after});
      result = site;
    } else if (resource === 'announcements' && !code) {
      const audience = text(data.audience, 16), message = text(data.message, 1600);
      if (!['all','operator','reviewer','admin'].includes(audience)) return fail(422, 'Select an announcement audience.');
      // The local provider has only the sender's authorized profile. Delivery stays in this browser.
      const item: Announcement | null = audience === 'all' || audience === user.role
        ? {id:announcements.length + 1, account:user.username, type:'announcement', at:stamp(Date.now()),
          message, actor:user.display_name, is_simulated:true} : null;
      if (item) announcements.push(item);
      const recipient_count = item ? 1 : 0;
      auditEntry(user, {action:'announcement', audience, recipient_count});
      result = {recipient_count, outcome:item ? 'sent' : 'empty', notification_id:item?.id ?? null};
    } else {
      return fail(404, 'Unsupported demonstration action');
    }
    writes.set(key, {input, result:structuredClone(result)});
    return result;
  }

  return {stations, read, mutate};
}
