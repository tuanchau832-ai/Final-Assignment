import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addMonths, costBasis } from './pilot-service-basis.mjs';

const website = fileURLToPath(new URL('../', import.meta.url));
const content = resolve(website, 'content');

export function moneyCents(value) {
  if (!/^\d+(?:\.\d{1,2})?$/.test(String(value))) throw new Error('Use a nonnegative price with at most two decimal places.');
  const [whole, fraction = ''] = String(value).split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents)) throw new Error('Price exceeds safe integer precision.');
  return cents;
}

export function prepaidCycles(origin = '2027-01-01', starts = [0, 6, 6], endMonth = 36, cycleDays = 30) {
  const first = new Date(`${origin}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(origin) || !Number.isFinite(+first)
      || first.toISOString().slice(0, 10) !== origin || !Number.isInteger(cycleDays) || cycleDays < 1) {
    throw new Error('Use a valid civil date and positive integer cycle length.');
  }
  const basis = costBasis(starts, endMonth), end = addMonths(first, endMonth);
  return basis.stations.map(station => {
    const date = addMonths(first, station.start);
    const days = (+end - +date) / 86_400_000;
    const cycles = Math.ceil(days / cycleDays);
    const purchaseDates = Array.from({ length: cycles }, (_, i) => +date + i * cycleDays * 86_400_000);
    const purchasesByProjectYear = basis.years.map(({ year }) => purchaseDates.filter(d =>
      d >= +addMonths(first, (year - 1) * 12) && d < +addMonths(first, Math.min(year * 12, endMonth))).length);
    return { station: station.id, start: date.toISOString().slice(0, 10),
      endExclusive: end.toISOString().slice(0, 10), operatingDays: days,
      cycles, cycleDays, purchasesByProjectYear };
  });
}

export function buildComparison(observations) {
  const find = id => {
    const source = observations.find(row => row.id === id);
    if (!source || source.status !== 'verified_listing' || source.listed_price === undefined) {
      throw new Error(`No verified current listing for ${id}`);
    }
    if (!['USD', 'VND'].includes(source.currency)) throw new Error('Unsupported currency.');
    return source;
  };
  const item = (id, quantity = 1) => {
    const source = find(id), unitCents = moneyCents(source.listed_price);
    return { id, sku: source.sku, quantity, currency: source.currency, unitCents,
      subtotalCents: quantity * unitCents, sourceUrl: source.url, checkedDate: source.checked_date };
  };
  const common = ['current-ph', 'current-do', 'current-turbidity', 'current-temperature', 'current-rs485'];
  const shared = () => [...common.map(id => item(id)), item('current-gland', 4)];
  const specs = [
    ['A', 'Separate ESP32 + M.2 module', [...shared(), item('current-esp32'), item('current-modem')],
      'Carrier and antennas remain unpriced; do not add the full HAT while retaining the module.'],
    ['B', 'Integrated LILYGO Q190 4 MB', [...shared(), item('lilygo-Q190')],
      'Replaces both separate board and modem; listed SIM/GPS antennas do not establish outdoor sealing, diversity or field acceptance.'],
    ['A-kit', 'ESP32 + complete Waveshare 21707 kit', [...shared(), item('current-esp32'), item('full-modem-kit-candidate')],
      'The kit replaces the module and carrier/antenna package; ESP32 UART and power integration still require validation.'],
  ];
  const missing = ['sensor interfaces, ADC/pin allocation and integration validation', 'offline buffer media, retention sizing and integration', 'selected enclosure and assembled waterproofing', 'complete compatible power system',
    'site cables, mounts, cage and any wiper', 'delivery, international taxes and payment/FX fees',
    'installation, commissioning and initial calibration', 'training', 'full calibration supplies/labour/travel',
    'six testing route packages', 'DO consumables and condition-based replacements',
    'fault and flood response', 'software/support, messaging and laboratory verification', 'end-of-life collection'];
  const configurations = specs.map(([id, label, items, packageLimits]) => {
    const sum = currency => items.filter(row => row.currency === currency).reduce((n, row) => n + row.subtotalCents, 0);
    return { id, label, status: 'comparison_only_not_selected_or_ordered', items, packageLimits,
      perStationListedCents: { VND: sum('VND'), USD: sum('USD') },
      threeStationListedCents: { VND: 3 * sum('VND'), USD: 3 * sum('USD') },
      totalInstalledCapex: null, totalThreeYearLifecycleCost: null,
      unpricedRequiredScope: id === 'A' ? ['M.2 carrier and antenna package', ...missing] : missing };
  });
  const cycles = prepaidCycles();
  const chosen = configurations.find(c => c.id === 'B');
  chosen.status = 'selected_for_proposed_costing_not_purchase_or_acceptance';
  const costingRate = 25940;
  const selectedItems = chosen.items.map(i => ({ ...i,
    budgetUnitVnd: i.currency === 'USD' ? Math.round(i.unitCents * costingRate / 100) : i.unitCents / 100,
    conversionStatus: i.currency === 'USD' ? 'budget_conversion_at_historical_rate_not_a_current_FX_quote' : 'native_VND_listing' }));
  const unitVnd = selectedItems.reduce((n, i) => n + i.quantity * i.budgetUnitVnd, 0);
  const sharedKitVnd = Math.round(item('current-ph').unitCents * costingRate / 100);
  const selectedCostingBasis = { id: 'B', label: chosen.label,
    authority: 'User requested comparison of cost, feasibility, pros and cons and delegated the best supported costing choice on 2026-11-28.',
    decision: 'Choose Q190 for proposed costing, not purchase, proven lowest lifecycle cost or field acceptance.',
    rationale: 'Factory integrated controller/modem and listed antenna package reduce custom carrier integration. Both listed currency portions are below the full HAT alternative. OPEX advantage is unproven.',
    items: selectedItems, unitVnd, nextTwoVnd: 2 * unitVnd, threeStationVnd: 3 * unitVnd,
    sharedKitVnd, firstStationPlusReserveVnd: unitVnd + sharedKitVnd,
    threeStationsPlusReserveVnd: 3 * unitVnd + sharedKitVnd,
    budgetVndPerUsd: costingRate, rateBasisDate: '2026-11-19',
    rounding: 'Convert each USD unit price at 25940, round each unit to the nearest VND, then multiply quantities. Not a current FX quote.',
    totalInstalledCapex: null, totalThreeYearLifecycleCost: null,
    excluded: chosen.unpricedRequiredScope };
  return { checkedDate: '2026-11-28', priceBasis: 'Current native-currency comparison is unconverted; selected B separately uses the explicit historical-rate budget assumption. Listings are not quotations.',
    timing: 'Illustrative starts at months 0/6/6; common 36-month close. Later prices assumed constant only for comparison, not guaranteed.',
    configurations, selectedCostingBasis, optionalSharedKit: { ...item('current-ph'), treatment: 'Add one kit once across the project; excluded from configuration totals.' },
    spareElectrodeCandidate: { ...item('spare-electrode-candidate'), treatment: 'FIT0348 listing verified; compatibility and replacement quantity not established. Not added to kit reserve or annual costs.' },
    serviceScope: costBasis(),
    simCandidate: { provider: 'Viettel', plan: 'Connect8 / M8_64KB', listedVndPer30Days: 8000,
      billingStatus: 'Illustration assumes advance purchase of enough non-prorated consecutive 30-day cycles; eligibility, coverage, tax and activation fees unconfirmed.',
      sourceUrl: 'https://iot.viettel.vn/', stationCycles: cycles, totalCycles: cycles.reduce((n, row) => n + row.cycles, 0),
      cyclesByProjectYear: costBasis().years.map(({ year }) => cycles.reduce((n, row) => n + row.purchasesByProjectYear[year - 1], 0)),
      exampleListedVnd: 8000 * cycles.reduce((n, row) => n + row.cycles, 0), selected: false },
    hostingCandidate: { provider: 'Render', webComputeUsdPerMonth: '7.00', postgresComputeUsdPerMonth: '6.00',
      computeOnlyUsdPerMonth: '13.00', systemMonths: 36, exampleComputeOnlyUsd: '468.00',
      excluded: ['workspace charges if applicable', 'database storage', 'bandwidth and other usage', 'MQTT broker if separately hosted', 'support', 'tax/payment fees'],
      sourceUrl: 'https://render.com/pricing', selected: false, capacityValidated: false },
    historicalBridgeA: { vndPerUsd: 25940, rateDate: '2026-11-19',
      perStationVnd: (configurations[0].perStationListedCents.VND + configurations[0].perStationListedCents.USD * 25940) / 100,
      threeStationsPlusOneKitVnd: (configurations[0].threeStationListedCents.VND + (configurations[0].threeStationListedCents.USD + item('current-ph').subtotalCents) * 25940) / 100,
      treatment: 'Reconciles the existing VND reference only; not a current FX quote or selected integrated-BOM cost.' } };
}

export function outputs(model) {
  const amount = cents => (cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 });
  const usd = cents => (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const rows = model.configurations.map(c => [c.label + (c.id === model.selectedCostingBasis.id ? ' (costing choice)' : ''), amount(c.perStationListedCents.VND),
    usd(c.perStationListedCents.USD), amount(c.threeStationListedCents.VND),
    usd(c.threeStationListedCents.USD), 'Incomplete; ' + c.packageLimits]);
  rows.push(['One optional shared pH kit', '0', '64.90 once', '0', '64.90 once', 'Excluded above; shared once, not per station or per year.']);
  const columns = ['configuration', 'record_type', 'item', 'quantity', 'unit_price', 'currency', 'subtotal', 'status', 'source_url', 'notes'];
  const records = model.configurations.flatMap(c => c.items.map(i => [c.id, 'equipment_line', i.sku, i.quantity,
    (i.unitCents / 100).toFixed(2), i.currency, (i.subtotalCents / 100).toFixed(2), c.status, i.sourceUrl, 'Listed portion only; required exclusions remain.']));
  for (const c of model.configurations) for (const currency of ['VND', 'USD']) {
    records.push([c.id, 'per_station_partial', 'Listed equipment portion', 1, '', currency, (c.perStationListedCents[currency] / 100).toFixed(2), 'not_total_capex', '', c.packageLimits]);
    records.push([c.id, 'three_station_partial', 'Listed equipment portion', 3, '', currency, (c.threeStationListedCents[currency] / 100).toFixed(2), 'not_total_lifecycle', '', 'CAPEX not multiplied by three operating years.']);
  }
  for (const c of model.configurations) for (const missing of c.unpricedRequiredScope) records.push([c.id, 'unpriced_required_scope', missing, '', '', '', '', 'quote_required', '', 'Unknown, not zero; not included in partial totals.']);
  records.push(['shared', 'optional_reserve', 'One SEN0169-V2 kit', 1, '64.90', 'USD', '64.90', 'optional_not_in_totals', model.optionalSharedKit.sourceUrl, 'One shared purchase, no annual multiplication.']);
  records.push(['shared', 'candidate_only', 'Viettel Connect8: dated 30-day billing example', model.simCandidate.totalCycles, '8000', 'VND', String(model.simCandidate.exampleListedVnd), 'unselected_service_scenario', model.simCandidate.sourceUrl, model.simCandidate.billingStatus]);
  records.push(['shared', 'candidate_only', 'Render web and Postgres compute only', 36, '13.00', 'USD', '468.00', 'unselected_service_scenario', model.hostingCandidate.sourceUrl, model.hostingCandidate.excluded.join('; ')]);
  const selected = model.selectedCostingBasis;
  for (const i of selected.items) records.push(['B', 'selected_costing_line', i.sku, i.quantity, i.budgetUnitVnd, 'VND', i.quantity * i.budgetUnitVnd,
    'costing_selection_not_purchase', i.sourceUrl, selected.rounding]);
  for (const [label, value] of [['one_station', selected.unitVnd], ['next_two', selected.nextTwoVnd], ['three_stations', selected.threeStationVnd],
    ['one_optional_shared_kit', selected.sharedKitVnd], ['three_stations_plus_one_shared_kit', selected.threeStationsPlusReserveVnd]]) {
    records.push(['B', 'selected_partial_subtotal', label, '', '', 'VND', value, 'incomplete_not_total_CAPEX_or_lifecycle', '', selected.rounding]);
  }
  const escape = v => '"' + String(v).replaceAll('"', '""') + '"';
  const procurementColumns = ['id', 'item', 'classification', 'phase1_quantity', 'phase2_quantity', 'project_quantity', 'budget_unit_vnd', 'phase1_vnd', 'phase2_vnd', 'project_vnd', 'source_native_unit_price', 'source_currency', 'source_url', 'checked_date', 'notes'];
  const procurement = selected.items.map(i => [i.id, i.sku, 'listed_price_with_explicit_budget_conversion', i.quantity, 2 * i.quantity, 3 * i.quantity,
    i.budgetUnitVnd, i.quantity * i.budgetUnitVnd, 2 * i.quantity * i.budgetUnitVnd, 3 * i.quantity * i.budgetUnitVnd,
    (i.unitCents / 100).toFixed(2), i.currency, i.sourceUrl, i.checkedDate, selected.rounding]);
  procurement.push(['optional-shared-kit', 'SEN0169-V2 shared reserve', 'optional_not_automatic', 1, 0, 1, selected.sharedKitVnd, selected.sharedKitVnd, 0, selected.sharedKitVnd, '64.90', 'USD', model.optionalSharedKit.sourceUrl, model.checkedDate, 'One shared kit once; no annual multiplication.']);
  procurement.push(['equipment-partial', 'Selected equipment without reserve', 'partial_not_total_CAPEX', '', '', '', '', selected.unitVnd, selected.nextTwoVnd, selected.threeStationVnd, '', '', '', model.checkedDate, selected.rounding]);
  procurement.push(['with-reserve-partial', 'Selected equipment plus one optional shared kit', 'partial_not_total_lifecycle', '', '', '', '', selected.firstStationPlusReserveVnd, selected.nextTwoVnd, selected.threeStationsPlusReserveVnd, '', '', '', model.checkedDate, 'Unpriced required scope remains excluded.']);
  return { json: JSON.stringify(model, null, 2) + '\n',
    csv: columns.join(',') + '\n' + records.map(r => r.map(escape).join(',')).join('\n') + '\n',
    selected: procurementColumns.join(',') + '\n' + procurement.map(r => r.map(escape).join(',')).join('\n') + '\n',
    ts: '// Generated by scripts/current-cost-comparison.mjs from verified native-currency listings.\n'
      + 'export const currentCostComparisonRows = ' + JSON.stringify(rows, null, 2) + ' as const;\n'
      + 'export const selectedCostingSummary = ' + JSON.stringify({ unitVnd: selected.unitVnd, nextTwoVnd: selected.nextTwoVnd,
        threeStationVnd: selected.threeStationVnd, sharedKitVnd: selected.sharedKitVnd, firstStationPlusReserveVnd: selected.firstStationPlusReserveVnd,
        threeStationsPlusReserveVnd: selected.threeStationsPlusReserveVnd }, null, 2) + ' as const;\n' };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const observations = JSON.parse(readFileSync(resolve(content, 'cost-research-2026-11-28/price-verification.json'), 'utf8')).observations;
  const model = buildComparison(observations), files = outputs(model);
  const paths = { json: resolve(content, 'current-cost-comparison-2026-11-28.json'),
    csv: resolve(content, 'current-cost-comparison-2026-11-28.csv'), selected: resolve(content, 'selected-procurement-2026-11-28.csv'),
    ts: resolve(website, 'src/content/current-cost-comparison.ts') };
  for (const key of Object.keys(paths)) {
    if (process.argv.includes('--check')) {
      if (readFileSync(paths[key], 'utf8') !== files[key]) throw new Error(`Stale generated comparison: ${paths[key]}`);
    } else writeFileSync(paths[key], files[key]);
  }
  console.log(JSON.stringify({ mode: process.argv.includes('--check') ? 'check' : 'generate', configurations: model.configurations.length,
    sim30DayCycles: model.simCandidate.totalCycles, historicalBridgeVnd: model.historicalBridgeA.threeStationsPlusOneKitVnd,
    lifecycleTotals: model.configurations.map(c => c.totalThreeYearLifecycleCost) }));
}
