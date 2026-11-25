import { describe, expect, it } from 'vitest';
import { matchesStation, snapshotStatus } from './mapStations';
import type { Station, Snapshot } from './types';

const station: Station = {
  code: 'HWW-TLH-001', river: 'Tô Lịch',
  name: { en: 'Tô Lịch demo station', vi: 'Trạm Tô Lịch' },
  data_mode: 'replay_loop', location: { lat: 21.015, lng: 105.811 }
};

describe('station search and filtering', () => {
  it('finds a station by its river, Vietnamese name without accents, or code', () => {
    for (const term of ['to lich', 'tram to lich', 'tlh-001']) {
      expect(matchesStation(station, 'offline', new URLSearchParams({ q: term }))).toBe(true);
    }
    expect(matchesStation(station, 'offline', new URLSearchParams({ q: 'unknown' }))).toBe(false);
  });
  it('requires every selected filter and does not infer station condition from its configured source', () => {
    expect(matchesStation(station, 'offline', new URLSearchParams({ river: 'Tô Lịch', status: 'offline' }))).toBe(true);
    expect(matchesStation(station, 'offline', new URLSearchParams({ river: 'Nhuệ', status: 'offline' }))).toBe(false);
    expect(matchesStation(station, 'unavailable', new URLSearchParams({ status: 'normal' }))).toBe(false);
  });
  it('never reports an old normal snapshot as current after the connection fails', () => {
    const previous = { station_status: 'normal' } as Snapshot;
    expect(snapshotStatus(previous, false)).toBe('normal');
    expect(snapshotStatus(previous, true)).toBe('unavailable');
    expect(snapshotStatus(undefined, false)).toBe('unavailable');
  });
});
