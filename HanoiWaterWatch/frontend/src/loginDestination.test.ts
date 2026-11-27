import { describe, expect, it } from 'vitest';
import { loginDestination } from './loginDestination';

describe('post-login navigation', () => {
  it('uses Map Home for a new session or unsupported destination', () => {
    for (const target of [null, '', '/', '/login', '/unknown', '/api/v1/auth/me']) {
      expect(loginDestination(target)).toBe('/map');
    }
  });
  it('returns the full supported deep link', () => {
    for (const target of ['/map?station=HWW-TLH-001', '/alerts/12?station=HWW-KNG-001#history', '/simulation', '/overview', '/overview/alerts/12?station=HWW-KNG-001#history', '/overview/alerts', '/admin', '/stations/HWW-NHU-001/model?sensor=ph', '/stations/HWW-KNG-001/dashboard?range=24']) {
      expect(loginDestination(target)).toBe(target);
    }
  });
  it('discards external destinations', () => {
    for (const target of ['https://example.org', '//example.org', '/\\example.org', '/map/../login']) {
      expect(loginDestination(target)).toBe('/map');
    }
  });
});
