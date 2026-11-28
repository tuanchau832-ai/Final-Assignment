import type { ReportSection } from '../types';
import { references } from '../references';
import { selectedCostingSummary as selected } from '../current-cost-comparison';
import { planningSummary as budget } from '../planning-budget';

const plan = references.find(item => item.id === 'tuan-first-station-plan')!;

export default {
  title: "Implementation",
  label: "Implementation",
  summary: "Test one station before expanding within a common 36-month project; dates, technical approval and complete quotations remain pending.",
  topics: [
    {
      id: "rollout",
      title: "Pilot and rollout",
      pending: "Define the proposed site selection, permissions, installation, commissioning, milestones, dependencies, and acceptance checks. Identify future milestones as planned.",
      paragraphs: [{ text: 'Cost coordination follows the first-station proposal: survey and obtain matching installed quotations, test one station with a two-week baseline, and order the next two only after documented acceptance, site permission and refreshed price approval. The costing horizon ends 36 months after the first commissioning. Starts at 0/6/6 are an illustration, not booked installation dates. Technical milestones and signatories remain for the implementation team to approve.', citations: [plan] }, { text: `The Q190 core equipment basis is ${selected.unitVnd.toLocaleString('en-US')} VND per station and ${selected.threeStationsPlusReserveVnd.toLocaleString('en-US')} VND for three stations plus one optional shared pH kit. The modelled 36-month budget is ${budget.totalVnd.toLocaleString('en-US')} VND including internal allowances and 20% contingency; see Cost Analysis and Appendix E. It is an estimate, not a quotation.` }],
      table: {
        id: 'rollout-cost-basis',
        caption: 'Cost basis for illustrative starts at months 0/6/6; common close at month 36',
        columns: ['Project period', 'SIM-months', 'Shared hosting months', 'Station checks', 'Testing rounds'],
        rows: [ ['Year 1', '24', '12', '4', '2'], ['Year 2', '36', '12', '6', '2'], ['Year 3', '36', '12', '6', '2'], ['Total', '96', '36', '16', '6'] ],
      },
      documents: [{ title: 'Cost Analysis: listed equipment and unquoted services', url: '/pages/cost-analysis' }, { title: 'First-station proposal reviewed 28 November', url: plan.url! }],
    },
    {
      id: "responsibilities",
      title: "Operations and responsibilities",
      pending: "Record proposed owners for monitoring, calibration, maintenance, access, incident response, and handover. Identify agreements that need confirmation.",
      paragraphs: [{ text: 'Testing follows each station every six months. The final round includes project-close wear reviews; with starts at 0/6/6, only station 1 has reached age 36 months and stations 2 and 3 are age 30. The planning budget funds 36 monthly field rounds, including all pH calibration, DO cleaning and the 6 testing rounds. It assumes early DO/SEN0710 calibration every two months: 48 tasks per sensor type across active stations. This supersedes the strict-90-day example for this budget. Labour/travel are not charged twice. Named primary and backup operators, access, funding and the resources to restore service within 48 hours still require agreement. These are costing assumptions, not signed operating commitments.', citations: [plan] }],
    },
    {
      id: "risks",
      title: "Risks and contingencies",
      pending: "Add installation and operational risks with mitigation, fallback processes, and review owners.",
    },
  ],
} satisfies ReportSection;
