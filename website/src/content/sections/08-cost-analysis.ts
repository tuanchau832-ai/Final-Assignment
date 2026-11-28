import type { ReportSection } from '../types';
import { references } from '../references';
import { planningSummary as budget, planningSummaryRows } from '../planning-budget';
import { selectedCostingSummary as core } from '../current-cost-comparison';
const cite = (id: string) => references.find(r => r.id === id)!;
const vnd = (n: number) => n.toLocaleString('en-US');

export default {
  title: 'Cost analysis',
  label: 'Cost analysis',
  summary: 'A staged three-station planning budget combining sourced equipment prices with explicit internal allowances.',
  topics: [
    {
      id: 'cost-scope',
      title: 'Basis and scope',
      paragraphs: [{
        text: 'Capital expenditure (CAPEX) covers equipment and setup; operating expenditure (OPEX) covers services while active. Q190 core equipment is '+vnd(core.unitVnd)+' VND per station, or '+vnd(core.threeStationsPlusReserveVnd)+' VND for three stations and one optional shared pH kit. These hardware subtotals exclude the remaining pilot costs. The budget uses a historical 25,940 VND/USD assumption, not a current transaction rate.',
        citations: [cite('lilygo-controller'), cite('hshop-do'), cite('dfrobot-ph'), cite('dfrobot-turbidity'), cite('vietcombank-rate')],
      }, {
        text: 'The 36-month project starts one station before two more at illustrative month six. The 100W/40Ah power configuration and unquoted items are planning assumptions. Listed prices, market benchmarks and internal allowances are distinguished in Appendix E; simulated results do not establish field performance.',
      }],
    },
    {
      id: 'lifecycle-cost',
      title: 'Three-year budget',
      paragraphs: [{
        text: 'Table 4 estimates '+vnd(budget.totalVnd)+' VND including 20% contingency. Its low–high scenarios reflect different allowances, not guaranteed prices. Labour uses 600,000 VND per person-day, informed by published electrical-work benchmarks. Future prices are held constant for comparison.',
        citations: [cite('fdi-labour-benchmark'), cite('tiasang-labour-benchmark')],
      }, {
        text: 'Thirty-six monthly field rounds include pH calibration, DO cleaning and the six testing rounds; 16 station checks are not extra journeys. Early DO/turbidity calibration every two months stays within 90 days. Shared hosting is counted once. Renewal, incidents, delivery, supply-tax uncertainty and disposal have separate allowances; full-probe DO reserves cover unavailable cap pricing.',
        citations: [cite('dfrobot-ph-calibration'), cite('dfrobot-do-maintenance'), cite('dfrobot-turbidity'), cite('render-hosting-price')],
      }],
      table: {
        id: 'cost-schedule',
        caption: 'Table 4. Modelled pilot budget (VND); estimates, not supplier quotations',
        columns: ['Category', 'Three-year VND', 'Scope'],
        rows: planningSummaryRows,
        wide: true,
        scrollHint: 'Scroll horizontally to view the budget and scope.',
      },
    },
    {
      id: 'funding',
      title: 'Affordability and payment proposal',
      paragraphs: [{
        text: 'A proposed municipal or institutional pilot fund would cover setup. Operations and renewal average about 5.31 million VND per project-month before contingency. This proposal charges households no monitoring fee and assumes no grant, income or unpaid labour. These are proposed funding roles, not commitments; income evidence does not establish affordability. If recurring funding is insufficient, retain one pilot and defer expansion.',
      }, {
        text: 'Ordering the next two stations requires acceptance and an updated budget. Field power, coverage and repair capacity remain untested; the 48-hour response target is not a contracted service. Contingency does not guarantee performance or unlimited incident coverage.',
      }],
    },
    {
      id: 'reference-additions',
      title: 'Supporting records',
      documents: [
        { title: 'Appendix E: itemised budget, sources and assumptions', url: '/pages/appendices#cost-budget-detail' },
        { title: 'Download cost section and appendices (Word)', url: '/documents/ba-nguyen-cost-submission-2026-11-28.docx' },
      ],
    },
  ],
} satisfies ReportSection;
