import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildComparison, moneyCents, prepaidCycles } from '../scripts/current-cost-comparison.mjs';

const observations = JSON.parse(readFileSync(new URL('../content/cost-research-2026-11-28/price-verification.json', import.meta.url), 'utf8')).observations;
const model = buildComparison(observations);
assert.equal(moneyCents('69.34'), 6934);
assert.equal(moneyCents('4428000'), 442800000);
for (const value of ['-1', '1.999', 'NaN', '', null]) assert.throws(() => moneyCents(value));
assert.deepEqual(model.configurations.map(c => c.perStationListedCents), [
  { VND: 627170000, USD: 29390 }, { VND: 451070000, USD: 36324 }, { VND: 470570000, USD: 40789 },
]);
assert.deepEqual(prepaidCycles().map(s => [s.operatingDays, s.cycles]), [[1096, 37], [915, 31], [915, 31]]);
assert.equal(model.simCandidate.totalCycles, 99);
assert.equal(model.simCandidate.exampleListedVnd, 792000);
assert.deepEqual(model.simCandidate.cyclesByProjectYear, [27, 36, 36]);
assert.equal(prepaidCycles('2027-01-01', [0, 0, 0]).reduce((n, s) => n + s.cycles, 0), 111);
for (const args of [['2027-02-30'], ['2027-01-01', [0], 36, 0], ['2027-01-01', [-1]]]) assert.throws(() => prepaidCycles(...args));
assert.equal(model.serviceScope.simMonths, 96);
assert.equal(model.serviceScope.sharedHostingMonths, 36);
assert.equal(model.serviceScope.stationChecks, 16);
assert.equal(model.historicalBridgeA.perStationVnd, 13895466);
assert.equal(model.historicalBridgeA.threeStationsPlusOneKitVnd, 43369904);
assert.equal(model.selectedCostingBasis.id, 'B');
assert.equal(model.selectedCostingBasis.unitVnd, 13933146);
assert.equal(model.selectedCostingBasis.nextTwoVnd, 27866292);
assert.equal(model.selectedCostingBasis.threeStationVnd, 41799438);
assert.equal(model.selectedCostingBasis.threeStationsPlusReserveVnd, 43482944);
assert.equal(model.selectedCostingBasis.firstStationPlusReserveVnd, 15616652);
assert.equal(model.selectedCostingBasis.totalThreeYearLifecycleCost, null);
assert.equal(model.optionalSharedKit.quantity, 1);
assert.equal(model.spareElectrodeCandidate.unitCents, 4950);
for (const c of model.configurations) {
  assert.equal(c.totalInstalledCapex, null);
  assert.equal(c.totalThreeYearLifecycleCost, null);
  assert.ok(c.unpricedRequiredScope.length > 0);
  assert.equal(c.threeStationListedCents.USD, 3 * c.perStationListedCents.USD);
  const ids = c.items.map(i => i.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!ids.includes('legacy-turbidity-candidate'));
  assert.ok(!(ids.includes('lilygo-Q190') && ids.includes('current-modem')));
  assert.ok(!(ids.includes('full-modem-kit-candidate') && ids.includes('current-modem')));
}
assert.throws(() => buildComparison(observations.filter(o => o.id !== 'lilygo-Q190')));
console.log('Current cost comparison: currency arithmetic, package replacement, 30-day billing, shared reserve and unknown totals verified.');
