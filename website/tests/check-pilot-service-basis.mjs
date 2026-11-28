import assert from 'node:assert/strict';
import { costBasis, calibrationExample, addMonths, phQuoteCoverage } from '../scripts/pilot-service-basis.mjs';

const staged = costBasis();
assert.deepEqual([staged.simMonths, staged.sharedHostingMonths, staged.stationChecks, staged.testingRounds], [96, 36, 16, 6]);
assert.deepEqual(staged.years.map(y => [y.simMonths, y.stationChecks, y.testingRounds]), [[24, 4, 2], [36, 6, 2], [36, 6, 2]]);
assert.equal(staged.age36Reviews, 1);
assert.equal(staged.projectCloseReviews, 3);
assert.deepEqual(staged.stations[1].checks, [12, 18, 24, 30, 36]);
const together = costBasis([0, 0, 0]);
assert.deepEqual([together.simMonths, together.stationChecks, together.age36Reviews], [108, 18, 3]);
const extended = costBasis([0, 6, 6], 42);
// This generic project-horizon model keeps ST-01 operating to month 42: distinguish it from
// the older CSV scenario that stops EACH station at age 36 (108 SIM-months / 18 checks).
assert.deepEqual([extended.simMonths, extended.sharedHostingMonths, extended.stationChecks, extended.testingRounds], [114, 42, 19, 7]);
assert.throws(() => costBasis([0, -1, 6]));
assert.throws(() => costBasis([0, 36]));
assert.throws(() => calibrationExample('2027-02-30'));
assert.equal(addMonths(new Date('2028-01-31T00:00:00Z'), 1).toISOString().slice(0, 10), '2028-02-29');
const cal = calibrationExample();
assert.deepEqual([cal.phTasks, cal.phSameDateTestingTasks, cal.phOutsideTestingTasks, cal.turbidityTasks, cal.initialPackages], [96, 16, 80, 32, 3]);
for (const station of ['ST-01', 'ST-02', 'ST-03']) {
  const initial = cal.events.find(e => e.station === station && e.task === 'initial_calibration_and_acceptance');
  let previous = Date.parse(initial.date);
  for (const e of cal.events.filter(e => e.station === station && e.task === 'turbidity_calibration')) {
    assert.equal((Date.parse(e.date) - previous) / 86_400_000, 90);
    previous = Date.parse(e.date);
  }
}
assert.equal(cal.events.find(e => e.station === 'ST-01' && e.task === 'turbidity_calibration').date, '2027-04-01');
assert.equal(cal.events.filter(e => e.station === 'ST-01' && e.task === 'turbidity_calibration')[1].date, '2027-06-30');
assert.equal(cal.actualDatesConfirmed, false);
assert.equal(phQuoteCoverage().separatelyQuotedFullTasks, null);
assert.deepEqual(phQuoteCoverage().separatelyQuotedTaskRange, [80, 96]);
assert.equal(phQuoteCoverage().confirmedIncludedInTesting, null);
assert.equal(phQuoteCoverage(0).separatelyQuotedFullTasks, 96);
assert.equal(phQuoteCoverage(8).separatelyQuotedFullTasks, 88);
assert.equal(phQuoteCoverage(16).separatelyQuotedFullTasks, 80);
assert.throws(() => phQuoteCoverage(17));
assert.throws(() => phQuoteCoverage(-1));
assert.throws(() => phQuoteCoverage(1.5));
console.log('Pilot service checks passed: staged/simultaneous quantities, year allocation, age/closeout distinction, date validation, leap month and strict 90-day deadlines.');
console.log('Calibration quotation checks passed: unconfirmed inclusions stay unknown; 0/8/16 included full tasks leave 96/88/80 separately quoted tasks.');
