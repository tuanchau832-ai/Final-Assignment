import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dayMs = 86_400_000;

// A calibration check does not establish that a full calibration was included in a quote.
// null means no contractual evidence, rather than zero-priced or zero work.
export function phQuoteCoverage(confirmedIncluded = null) {
  const totalTasks = 96, overlappingTestingTasks = 16;
  if (confirmedIncluded !== null && (!Number.isInteger(confirmedIncluded)
      || confirmedIncluded < 0 || confirmedIncluded > overlappingTestingTasks)) {
    throw new Error('Confirmed full calibrations included in testing must be an integer from 0 to 16, or null.');
  }
  return { totalTasks, overlappingTestingTasks, physicallyOutsideTestingTasks: 80,
    confirmedIncludedInTesting: confirmedIncluded,
    separatelyQuotedFullTasks: confirmedIncluded === null ? null : totalTasks - confirmedIncluded,
    separatelyQuotedTaskRange: confirmedIncluded === null ? [80, 96] : [totalTasks - confirmedIncluded, totalTasks - confirmedIncluded],
    status: confirmedIncluded === null ? 'quote_inclusions_unconfirmed' : 'coverage_quantity_only_not_a_supplier_price' };
}

export function costBasis(starts = [0, 6, 6], endMonth = 36) {
  if (!Number.isInteger(endMonth) || endMonth < 1 || !starts.length
      || starts.some(m => !Number.isInteger(m) || m < 0 || m >= endMonth)) {
    throw new Error('Use integer commissioning offsets within the project horizon.');
  }
  const stations = starts.map((start, i) => {
    const checks = [];
    for (let month = start + 6; month <= endMonth; month += 6) checks.push(month);
    return { id: `ST-0${i + 1}`, start, operatingMonths: endMonth - start, checks,
      age36ReviewMonth: start + 36 <= endMonth ? start + 36 : null };
  });
  const rounds = [...new Set(stations.flatMap(s => s.checks))].sort((a, b) => a - b);
  const years = [];
  for (let from = 0; from < endMonth; from += 12) {
    const to = Math.min(from + 12, endMonth);
    years.push({ year: years.length + 1,
      simMonths: stations.reduce((n, s) => n + Math.max(0, to - Math.max(from, s.start)), 0),
      sharedHostingMonths: to - from,
      stationChecks: stations.reduce((n, s) => n + s.checks.filter(m => m > from && m <= to).length, 0),
      testingRounds: rounds.filter(m => m > from && m <= to).length });
  }
  return { starts, endMonth, stations, years, simMonths: stations.reduce((n, s) => n + s.operatingMonths, 0),
    sharedHostingMonths: endMonth, stationChecks: stations.reduce((n, s) => n + s.checks.length, 0),
    testingRounds: rounds.length, rounds,
    age36Reviews: stations.filter(s => s.age36ReviewMonth !== null).length,
    projectCloseReviews: stations.length };
}

// UTC civil dates avoid daylight-saving drift. Month arithmetic clamps to the month's last day.
export function addMonths(date, months) {
  const d = new Date(date);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months + 1, 0)).getUTCDate();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, Math.min(d.getUTCDate(), last)));
}

export function calibrationExample(origin = '2027-01-01', starts = [0, 6, 6], endMonth = 36) {
  const first = new Date(`${origin}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(origin) || !Number.isFinite(+first)
      || first.toISOString().slice(0, 10) !== origin) throw new Error('Use a valid ISO civil date.');
  const basis = costBasis(starts, endMonth), end = addMonths(first, endMonth);
  const iso = d => d.toISOString().slice(0, 10);
  const events = [];
  for (const station of basis.stations) {
    const start = addMonths(first, station.start);
    const testDates = new Set(station.checks.map(m => iso(addMonths(first, m))));
    const put = (date, task, scope) => events.push({ station: station.id, date: iso(date), task, scope,
      sameDateTesting: testDates.has(iso(date)) ? 'yes' : 'no',
      status: 'illustrative_dates_not_actual_service_booking' });
    put(start, 'initial_calibration_and_acceptance', 'one commissioning package; no repeat procurement');
    // Anchor monthly pH tasks to each commissioning date; initial calibration is listed separately.
    for (let m = 1; m <= station.operatingMonths; m++) {
      put(addMonths(start, m), 'ph_calibration', 'monthly RFQ policy; supplies and labour quote required');
    }
    // This deliberately does NOT replace a 90-day deadline with three calendar months.
    for (let due = new Date(+start + 90 * dayMs); due <= end; due = new Date(+due + 90 * dayMs)) {
      put(due, 'turbidity_calibration', '90-day deadline; may move earlier and reset next deadline');
    }
    for (const m of station.checks) put(addMonths(first, m), 'six_month_testing', 'testing includes routine cleaning and calibration checks');
    put(end, 'project_close_wear_review', station.operatingMonths >= 36 ? 'also reaches age 36 months' : `project close only; station age ${station.operatingMonths} months`);
  }
  events.sort((a, b) => a.date.localeCompare(b.date) || a.station.localeCompare(b.station) || a.task.localeCompare(b.task));
  const tasks = name => events.filter(e => e.task === name);
  const ph = tasks('ph_calibration'), turbidity = tasks('turbidity_calibration');
  return { origin, actualDatesConfirmed: false, policy: 'Independent monthly / exact-90-day example; early bundling changes later dates and counts. Task counts are not trips. End-date services are included for RFQ and require closeout-scope agreement.',
    phTasks: ph.length, phSameDateTestingTasks: ph.filter(e => e.sameDateTesting === 'yes').length,
    phOutsideTestingTasks: ph.filter(e => e.sameDateTesting === 'no').length,
    turbidityTasks: turbidity.length, turbiditySameDateTestingTasks: turbidity.filter(e => e.sameDateTesting === 'yes').length,
    turbidityOutsideTestingTasks: turbidity.filter(e => e.sameDateTesting === 'no').length,
    initialPackages: basis.stations.length, events };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = resolve(process.argv[2] ?? fileURLToPath(new URL('../content', import.meta.url)));
  mkdirSync(output, { recursive: true });
  const example = calibrationExample();
  const { events, ...calendarSummary } = example;
  const data = { reviewedAt: '2026-11-28', sourceCommit: 'ea4cce0ab3e1c520e074b48ae703d3dfe69570fb',
    horizonStatus: 'Tuan adopted common 36-month costing horizon; team and actual commissioning dates pending',
    selectedIllustration: costBasis(), simultaneousComparison: costBasis([0, 0, 0]), calendarExample: calendarSummary,
    phQuotationCoverage: phQuoteCoverage() };
  writeFileSync(resolve(output, 'pilot-service-basis-2026-11-28.json'), JSON.stringify(data, null, 2) + '\n');
  const keys = ['station', 'date', 'task', 'scope', 'sameDateTesting', 'status'];
  const csv = v => `"${String(v).replaceAll('"', '""')}"`;
  writeFileSync(resolve(output, 'calibration-calendar-example-2026-11-28.csv'),
    keys.join(',') + '\n' + events.map(e => keys.map(k => csv(e[k])).join(',')).join('\n') + '\n');
  console.log(JSON.stringify({ basis: data.selectedIllustration, calibration: { ...example, events: `${example.events.length} dated tasks` } }, null, 2));
}
