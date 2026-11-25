import type { Snapshot, Station, Status } from './types';

function normalize(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replaceAll('đ', 'd').trim();
}

export function matchesStation(station: Station, status: Status, filters: URLSearchParams) {
  const q = normalize(filters.get('q') || '');
  const names = typeof station.name === 'string' ? [station.name] : Object.values(station.name);
  const river = filters.get('river'), condition = filters.get('status'), channel = filters.get('channel');
  return (!q || [station.code, station.river, ...names].some(value => normalize(value).includes(q))) &&
    (!river || river === station.river) && (!condition || condition === status) &&
    (!channel || !!station.sensors?.some(sensor => sensor.channel === channel));
}

export function snapshotStatus(snapshot: Snapshot | undefined, disconnected: boolean): Status {
  return disconnected ? 'unavailable' : snapshot?.station_status || 'unavailable';
}
