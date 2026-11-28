import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
export function additionsModel(prices, base) {
  const ids = new Set();
  for (const p of prices) {
    if (ids.has(p.id) || !Number.isSafeInteger(p.unitVnd) || p.unitVnd < 1 || !['station', 'shared-starter'].includes(p.scope)) throw new Error('Invalid or duplicate listed component.');
    ids.add(p.id);
  }
  const perStationAdditionsVnd = prices.filter(p => p.scope === 'station').reduce((n,p) => n+p.unitVnd,0);
  const sharedStarterVnd = prices.filter(p => p.scope === 'shared-starter').reduce((n,p) => n+p.unitVnd,0);
  const hardwareAndStarterVnd = base.threeStationsPlusReserveVnd+3*perStationAdditionsVnd+sharedStarterVnd;
  const hostingComputeVnd = 468*base.budgetVndPerUsd;
  return { date:'2026-11-28', classification:'analyst_selected_reference_scenario_not_order_or_validated_engineering',
    core:base, prices, perStationAdditionsVnd, oneStationWithAdditionsVnd:base.unitVnd+perStationAdditionsVnd,
    threeStationAdditionsVnd:3*perStationAdditionsVnd, sharedStarterVnd, hardwareAndStarterVnd,
    sim:{plan:'Viettel Connect8',classification:'selected_only_for_low_bandwidth_cost_scenario',cycles:99,unitVnd:8000,listedTotalVnd:792000,eligibilityAndCoverageValidated:false},
    hosting:{classification:'selected_only_for_shared_compute_cost_scenario',months:36,computeUsdPerMonth:13,totalComputeUsd:468,computeBudgetVnd:hostingComputeVnd,storageAndCapacityValidated:false},
    priced36MonthScenarioVnd:hardwareAndStarterVnd+792000+hostingComputeVnd,
    completeInstalledCapex:null,completeLifecycleCost:null,
    powerSensitivity:{assumptionsNotMeasurements:true,panelW:100,batteryV:12,batteryAh:40,usableDepthFraction:0.5,deliveryEfficiency:0.85,
      solarDerating:0.7,cases:[2,4,8].map(loadW=>({loadW,demandWhPerDay:loadW*24,nominalAutonomyHours:12*40*.5*.85/loadW,
        harvestWhAt2PeakSunHours:100*2*.7,harvestWhAt4PeakSunHours:100*4*.7}))},
    bufferSensitivity:{assumptionsNotMeasurements:true,bytesPerRecord:1024,secondsPerRecord:2,days:7,rawBytes:1024*43200*7,withFourfoldOverheadBytes:1024*43200*7*4},
    phSupplySensitivity:{assumptionsNotMeasurements:true,tasksExcludingCommissioning:96,initialTasks:3,mlPerBufferPerTask:20,
      totalMlPerBuffer:99*20,bottlesPerBufferIgnoringExpiry:Math.ceil(99*20/500),twoBufferVolumeOnlyVnd:2*Math.ceil(99*20/500)*454000,
      note:'Volume-only illustration, not a three-year procurement plan: lot expiry, open-bottle lifetime, actual vessel immersion and repeat calibration can increase quantities. Starter bottles already counted; do not add the full volume illustration on top.'},
    calibrationBenchmark:{source:'https://metrotech.vn/hieu-chuan-may-do-ph/',lowVnd:100000,highVnd:200000,analystMidpointVnd:150000,
      lowScenarioVnd:80*100000,highScenarioVnd:96*200000,midpoint80TasksVnd:80*150000,midpoint96TasksVnd:96*150000,
      includedInTotals:false,note:'Public indicative shop price for other-store handheld/bench/pen meters; not a quote for installed SEN0169-V2, on-site work, accredited certification, travel or already included supplies. Do not combine with self-calibration materials as if both were mandatory.'},
    unresolved:['site cables and lengths; panel and probe supports; protective cage/wiper if used','battery weather protection and ventilation; installed seals and penetrations','electrical protection, earthing and surge/lightning design','analogue/RS485/1-Wire integration, firmware and power-loss-safe buffer validation','delivery, unlisted VAT/import/transaction costs','installation, commissioning, training, testing and field travel','remaining calibration standards, cleaning/rinse consumables and DO replacement parts','database storage, usage, MQTT if separate, support, SMS and laboratory services','condition-based replacements, incidents and end-of-life collection'],
    limits:['No assumed free labour, free travel, free hosting storage or confirmed funding.','Listings held constant for comparison; later procurement prices and component lifetime are not guaranteed.','One optional shared pH kit once; CAPEX is not multiplied by three operating years.'] };
}

export function renderAdditions(model) {
  const f=n=>n.toLocaleString('en-US');
  const rows=model.prices.map(p=>[p.item,p.scope==='station'?'1 per station':'1 shared starter',f(p.unitVnd),f(p.unitVnd*(p.scope==='station'?3:1)),p.limits]);
  rows.push(['Reference additions, excluding shared starters','3 station sets',f(model.perStationAdditionsVnd),f(model.threeStationAdditionsVnd),'Separate from the original Q190 equipment subtotal.']);
  rows.push(['Core equipment + optional reserve + reference additions + shared starters','Project, once','—',f(model.hardwareAndStarterVnd),'Partial listed scenario; installed CAPEX remains unknown.']);
  rows.push(['Same scenario + Connect8 billing example + Render compute only','Common 36-month illustration','—',f(model.priced36MonthScenarioVnd),'Partial priced components, not full lifecycle cost; service and tax exclusions remain.']);
  const columns=['id','item','classification','scope','unit_vnd','phase1_qty','phase2_qty','project_qty','phase1_vnd','phase2_vnd','project_vnd','source_url','checked_date','vat','limits'];
  const csvRows=model.prices.map(p=>[p.id,p.item,'listed_unit_price_with_assumed_reference_quantity',p.scope,p.unitVnd,1,p.scope==='station'?2:0,p.scope==='station'?3:1,p.unitVnd,p.scope==='station'?2*p.unitVnd:0,p.scope==='station'?3*p.unitVnd:p.unitVnd,p.url,model.date,p.vat,p.limits]);
  const esc=v=>'"'+String(v).replaceAll('"','""')+'"';
  return {json:JSON.stringify(model,null,2)+'\n',csv:columns.join(',')+'\n'+csvRows.map(r=>r.map(esc).join(',')).join('\n')+'\n',
    ts:'// Generated by scripts/cost-additions.mjs; reference quantities are assumptions, not an order.\nexport const referenceAdditionRows = '+JSON.stringify(rows,null,2)+' as const;\nexport const referenceAdditionSummary = '+JSON.stringify({perStationAdditionsVnd:model.perStationAdditionsVnd,hardwareAndStarterVnd:model.hardwareAndStarterVnd,priced36MonthScenarioVnd:model.priced36MonthScenarioVnd},null,2)+' as const;\n'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const prices=JSON.parse(readFileSync(resolve(root,'content/cost-additions-2026-11-28/price-scope.json'),'utf8'));
  const base=JSON.parse(readFileSync(resolve(root,'content/current-cost-comparison-2026-11-28.json'),'utf8')).selectedCostingBasis;
  const model=additionsModel(prices,base),rendered=renderAdditions(model);
  const paths={json:'content/reference-cost-scenario-2026-11-28.json',csv:'content/reference-cost-scenario-2026-11-28.csv',ts:'src/content/reference-cost-scenario.ts'};
  for(const [key,path] of Object.entries(paths)) {
    const target=resolve(root,path);
    if(process.argv.includes('--check')) {if(readFileSync(target,'utf8')!==rendered[key])throw new Error('Stale generated reference scenario: '+path);}
    else writeFileSync(target,rendered[key]);
  }
  console.log(JSON.stringify({mode:process.argv.includes('--check')?'check':'generate',referenceItems:prices.length,hardwarePartialVnd:model.hardwareAndStarterVnd,priced36MonthPartialVnd:model.priced36MonthScenarioVnd,completeLifecycleCost:model.completeLifecycleCost}));
}
