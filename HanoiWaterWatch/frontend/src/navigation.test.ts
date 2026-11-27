import { expect, it } from 'vitest';
import { destinations } from './navigation';

it('carries a selected map station through all station-aware destinations', () => {
  const paths = destinations('/map', '?station=HWW-TLH-001&range=6&sensor=ph');
  expect(paths.dashboard).toBe('/stations/HWW-TLH-001/dashboard?range=6&sensor=ph');
  expect(paths.overview).toBe('/overview?station=HWW-TLH-001');
  expect(paths.admin).toBe('/admin');
});
it('restores station context from legacy station links without selecting an unsolicited map marker', () => {
  expect(destinations('/stations/HWW-NHU-001/model', '').mapHome).toBe('/map?station=HWW-NHU-001');
  expect(destinations('/overview', '').mapHome).toBe('/map');
});
