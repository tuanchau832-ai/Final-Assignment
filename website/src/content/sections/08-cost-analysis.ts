import type { ReportSection } from '../types';
import { references } from '../references';
import { referenceAdditionRows, referenceAdditionSummary as additions } from '../reference-cost-scenario';
import { currentCostComparisonRows, selectedCostingSummary as selected } from '../current-cost-comparison';

const reference = (id: string) => references.find((item) => item.id === id)!;
const vnd = (value: number) => value.toLocaleString('en-US');

export default {
  title: 'Cost analysis',
  label: 'Cost analysis',
  summary: 'Listed equipment for a staged three-station pilot within one 36-month project; calibration tasks, shared services and unquoted costs remain separate.',
  topics: [
    {
      id: 'cost-scope',
      title: 'Costing scope and assumptions',
      paragraphs: [
        {
          text: "Capital expenditure (CAPEX) and operating expenditure (OPEX) cover a proposed three-station, 36-month project. Commission one station before ordering two more after acceptance and refreshed quotations. Listed hardware remains a reference configuration; simulated readings do not establish field performance.",
          citations: [reference('hww-blueprint'), reference('tuan-first-station-plan')],
        },
        {
          text: `LILYGO Q190 is chosen for costing: ${vnd(selected.unitVnd)} VND per station and ${vnd(selected.nextTwoVnd)} VND for the next two. Prices checked on 28 November use an explicit 25,940 VND/USD budget assumption from 19 November, rounding converted unit prices before multiplying quantities. Listings are not quotations; unspecified taxes, freight and exchange fees are excluded.`,
          citations: [reference('vietcombank-rate'), reference('lilygo-controller'), reference('hshop-do')],
        },
      ],
    },
    {
      id: 'lifecycle-cost',
      title: 'Lifecycle cost schedule',
      paragraphs: [
        {
          text: "Tables 4 and 4a compare controller alternatives with identical reference sensors. Q190 reduces separate carrier integration and costs less than the full-HAT alternative. Its single listed LTE antenna does not establish outdoor/diversity suitability. Complete installed power, housing and services remain unpriced; Table 4b adds a separately costed reference component scenario.",
          citations: [reference('dfrobot-ph'), reference('hshop-do'), reference('dfrobot-turbidity'), reference('hshop-temperature'), reference('hshop-rs485'), reference('vinadenki-enclosure'), reference('daihoaphu-gland'), reference('lilygo-controller'), reference('waveshare-full-modem-kit')],
        },
        {
          text: `One optional shared pH kit adds ${vnd(selected.sharedKitVnd)} VND once: three stations plus reserve total ${vnd(selected.threeStationsPlusReserveVnd)} VND, still incomplete. FIT0348 is separately listed at USD49.50; compatibility and replacement quantity remain unconfirmed. Electrode life is not a fixed replacement deadline. DO consumables remain unpriced.`,
          citations: [reference('dfrobot-ph'), reference('dfrobot-ph-electrode'), reference('dfrobot-do-specifications'), reference('tuan-first-station-plan')],
        },
        {
          text: "Illustrative starts at months 0/6/6 give 96 SIM-months, 36 shared hosting months and 16 station checks in six rounds. Closeout reviews cover stations aged 36/30/30 months. Testing includes cleaning and calibration checks; full calibration inclusions require quotation.",
          citations: [reference('dat-maintenance-response'), reference('tuan-first-station-plan')],
        },
        {
          text: "Budget 96 monthly pH tasks outside commissioning; 16 overlap testing. Full calibrations quoted separately range from 80 to 96 until inclusions are confirmed. The dated example gives 32 turbidity tasks before rescheduling; recalibrate within 90 days of the previous procedure. Tasks are not trips.",
          citations: [reference('dfrobot-ph-calibration'), reference('dfrobot-turbidity'), reference('tuan-first-station-plan')],
        },
        {
          text: "The first-station proposal uses Report rule, defers TDS and retains DS18B20 as a reference model. Operating and signatory roles remain unassigned.",
          citations: [reference('tuan-first-station-plan')],
        },
      ],
      table: {
        id: 'cost-schedule',
        caption: 'Table 4. Q190 costing choice, proposed unit prices and partial subtotal; shared pilot services and reserve are separate (VND, historical conversion assumption)',
        wide: true,
        scrollHint: 'Scroll horizontally to view all ten cost columns.',
        columns: ['Item and specification', 'Unit', 'Quantity', 'Unit cost', 'Cost type', 'Frequency', 'Subtotal', 'Price basis, source URL and date', 'Proposed payer', 'Maintenance / end-of-life'],
        rows: [
          ['LILYGO T-SIM7600G-H R2 4MB Q190 integrated ESP32/4G', 'kit', '1', '1,798,680', 'Listed price converted for costing', 'once', '1,798,680', 'USD69.34 x historical assumed 25,940, rounded per unit; China worldwide variant 42358717972661; checked 28 Nov 2026; Vietnam taxes/freight/fees unconfirmed', 'Payer unconfirmed', 'Includes listed SIM/GPS antennas, power cable and headers; not a battery/panel/probe-supply kit. Do not add separate ESP32, M.2 module or full HAT'],
          ['Industrial pH meter kit V2, 24/7 electrode (SEN0169-V2)', 'each', '1', '1,683,506', 'Supplier-listed CAPEX', 'once', '1,683,506', 'DFRobot list price USD 64.90 x historical 25,940; freight, import and exchange fees excluded; recorded 19 Nov; rechecked 28 Nov 2026', 'Payer unconfirmed', 'Manufacturer states >4,380-hour life; FIT0348 USD49.50 is a candidate electrode, not a confirmed compatible replacement or purchase'],
          ['RS485 fluorescence DO probe, freshwater, IP68 (SEN0680)', 'each', '1', '4,428,000', 'Supplier-listed CAPEX', 'once', '4,428,000', 'Hshop listing, VAT stated; delivery not stated; recorded 19 Nov; rechecked 28 Nov 2026', 'Payer unconfirmed', 'Film life stated as about one year; replacement quotation required'],
          ['Industrial RS485 turbidity sensor, 0-1,000 NTU (SEN0710)', 'each', '1', '5,940,260', 'Supplier-listed CAPEX', 'once', '5,940,260', 'DFRobot list price USD 229.00 x 25,940; freight, import and exchange fees excluded; recorded 19 Nov; rechecked 28 Nov 2026', 'Payer unconfirmed', 'Inspect for fouling during authorised visits'],
          ['Waterproof DS18B20 temperature probe', 'each', '1', '35,000', 'Supplier-listed CAPEX', 'once', '35,000', 'Hshop listing, VAT stated; delivery not stated; recorded 19 Nov; rechecked 28 Nov 2026', 'Payer unconfirmed', 'Validate wastewater compatibility before field use'],
          ['TTL-to-RS485 converter for shared sensor bus', 'each', '1', '35,000', 'Supplier-listed CAPEX', 'once', '35,000', 'Hshop listing, VAT stated; delivery not stated; recorded 19 Nov; rechecked 28 Nov 2026', 'Payer unconfirmed', 'Test after cable changes'],
          ['Viger ABS IP65 enclosure (candidate price reference)', 'each', 'TBD', '305,000', 'Price reference only', 'once', 'Not included', 'Vinadenki listing; VAT excluded; nationwide delivery stated but charge not stated; checked 19 Nov 2026', 'Payer unconfirmed', 'Exact model and size are not selected, so this price is not included in a subtotal'],
          ['PG13.5 cable gland (cable diameter to confirm)', 'each', '4', '3,175', 'Supplier-listed CAPEX', 'once', '12,700', 'Dai Hoa Phu price after 8% VAT; delivery not stated; checked 19 Nov 2026; page rechecked 25 Nov; price rechecked 28 Nov 2026', 'Payer unconfirmed', 'Listing says 7–12 mm near price but 6–12 mm in details; confirm fit and count against final cable schedule'],
          ['Listed-price procurement subtotal - not total CAPEX', 'station', '1', '-', 'Partial subtotal', 'once', vnd(selected.unitVnd), 'Formula: Q190 plus the same four sensors, RS485 converter and provisional glands; converted unit prices rounded before quantity', 'Payer unconfirmed', 'Excludes all quote-required rows below and the unselected enclosure reference'],
          ['Selected enclosure, cable entries and waterproofing', 'system', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'Choose dimensions, material, cable entries and seals after the equipment layout and site survey', 'Payer unconfirmed', 'Quote must state model, IP rating, VAT, delivery, penetrations and warranty'],
          ['Solar panel, battery, charge controller and regulated supply', 'system', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'Table 4b selects a 100W/12V-40Ah reference component scenario for costing, not a complete installed kit; validate load, charging settings, protection and shading', 'Payer unconfirmed', 'Quote must state panel, battery, controller, converter, protection and warranty'],
          ['Q190 outdoor antenna protection and any additional antenna/accessory requirement', 'set', 'TBD after coverage/fit checks', 'Quote required if needed', 'Conditional CAPEX', 'once', 'Not included', 'Base SIM/GPS antennas are already in the Q190 package. Outdoor sealing, cable routing and any required diversity hardware are not established', 'Payer unconfirmed', 'Do not charge for the included antenna package twice. Regulated power is scoped in the complete power-system row'],
          ['Outdoor cable, connectors, sensor rack and mounting hardware', 'site set', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'Cable lengths, connector types, corrosion grade and mounting method depend on authorised site survey', 'Payer unconfirmed', 'Record final cable schedule and grounding approach'],
          ['Offline buffer media and integration', 'system', 'TBD after retention sizing', 'Quote required', 'CAPEX', 'once', 'Not included', 'Table 4b prices a 32GB reference card separately; capacity, firmware buffering, wear and safe power-loss recovery require validation', 'Payer unconfirmed', 'Do not assume 4MB flash proves offline retention or buy the 16MB variant without a measured requirement'],
          ['Installation, commissioning and initial calibration', 'service', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'No public, site-specific contractor quote', 'Payer unconfirmed', 'Requires authorised access, acceptance checks and calibration records'],
          ['Operator training and deployment preparation', 'service', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'Training scope, provider and participants unconfirmed', 'Payer unconfirmed', 'Handover record and refresher scope need confirmation'],
          ['4G data plan', 'SIM-month or 30-day cycle', '96 calendar SIM-months; candidate needs 99 cycles', 'Quote required for selected service', 'Pilot OPEX', 'while active; confirm billing period', 'Not included', 'Viettel Connect8 M8_64KB lists 8,000 VND/30 days; dated example needs 37 + 31 + 31 cycles = 792,000 VND before unconfirmed fees/tax; checked 28 Nov 2026', 'Payer unconfirmed', 'Unselected candidate; eligibility, 64/64 Kbps suitability and site coverage unverified. Do not use 96 as the quantity of 30-day cycles'],
          ['Managed hosting and database', 'system-month', '36 shared', 'Quote required for selected service', 'Shared pilot OPEX', 'monthly from first station', 'Not included', 'Render lists web compute USD7 plus Postgres compute USD6 per month: USD468 over 36 months, before storage, usage, broker, support and taxes; checked 28 Nov 2026', 'Payer unconfirmed', 'Unselected capacity reference; not the complete hosting bill. Do not multiply shared hosting by three stations'],
          ['Monthly pH calibration, excluding commissioning', 'station task', '96 total; 80–96 separately quoted', 'Quote required', 'Pilot OPEX', 'monthly while active', 'Not included', '96 tasks, 16 overlap testing; quote 80 separately only if all 16 full procedures and supplies are explicitly included; otherwise quote the uncovered tasks up to 96', 'Proposed; agreement required', 'This replaces the old unsupported cleaning-cost scenario; it does not reinstate its prices'],
          ['SEN0710 recalibration, excluding commissioning', 'station task', '32 dated-example tasks before rescheduling', 'Quote required', 'Pilot OPEX', 'within 90 days of last calibration', 'Not included', 'Worksheet uses illustrative 1 Jan 2027 origin, not a selected deployment date; early bundling resets the next deadline', 'Proposed; agreement required', 'Do not treat three calendar months as 90 days or station tasks as travel visits'],
          ['Triggered cleaning and event calibration', 'service', 'TBD by condition', 'Quote required', 'Pilot OPEX', 'when drift, fouling or repair requires it', 'Not included', 'Keep separate from priced routine calibration and testing inclusions', 'Proposed; agreement required', 'No double charge for work already included in a scheduled package'],
          ['Shared pilot testing rounds: cleaning, calibration checks and alert test', 'route round', '6 example rounds covering 16 station checks', 'Quote required', 'Shared pilot OPEX', 'each station every six months', 'Not included', '0/6/6 illustration: round 6 checks only ST-01; rounds 12/18/24/30/36 check all three; 18 checks is the simultaneous-start comparison', 'Proposed; agreement required', 'Quote the actual route scope; adding commissioning work for ST-02/03 at month 6 must be itemised separately'],
          ['Project-close wear and corrosion review', 'station review within final round', '3 closeout reviews; only 1 at age 36 in example', 'Included in unquoted testing scope', 'Lifecycle scope memo', 'at common project month 36', 'Not priced separately', 'ST-02/03 are age 30 with 0/6/6 starts; closing the project does not make them 36 months old', 'Proposed; agreement required', 'No extra trip or duplicate review fee; condition-based parts and replacement labour require quotes'],
          ['Unscheduled repair and power-system maintenance', 'service', 'TBD', 'Quote required', 'OPEX', 'As needed; 48-hour repair requirement', 'Not included', 'Dat requires restoration within 48 hours from fault receipt by the operating team; actual capacity and contractual SLA are unverified', 'Proposed; agreement required', 'Name operator and escalation owner; quote event travel, labour and DO/pH parts separately'],
          ['Optional pH kit reserve shared by the pilot', 'shared kit', '1 across up to three stations', '1,683,506', 'Optional shared reserve', 'Once, not per station or year', '1,683,506', 'Same historical DFRobot USD 64.90 x 25,940; Tuan proposes a shared reserve; this is not a verified spare-probe price', 'Proposed; agreement required', 'Confirm compatibility, storage, replenishment and 48-hour access; do not pay again for the same kit when used'],
          ['DO film/sensor replacement', 'year', '1', 'Quote required', 'Lifecycle', 'at about 12 months', 'Not included', 'One-year film life stated, but no accessible replacement price', 'Payer unconfirmed', 'Obtain consumable or repair quotation before approval'],
          ['End-of-life collection and disposal', 'station', '1', 'Quote required', 'Lifecycle', 'at pilot close', 'Not included', 'Licensed e-waste and probe disposal route not selected', 'Payer unconfirmed', 'Confirm compliant collection route'],
          ['Reference-instrument hire, loan or verification service', 'service', 'TBD', 'Quote required', 'Pilot acceptance', 'Before ordering the next two stations', 'Not included', 'Compare candidate DO and turbidity probes near alert limits; availability, reference uncertainty and fee unconfirmed', 'Proposed; agreement required', 'A potential loan is not an arranged free service'],
          ['TDS extension for a future Team-rule trial', 'device and calibration', 'Excluded from first-station proposal', 'Quote required if added', 'Conditional CAPEX/OPEX', 'Only after design approval', 'Not included', 'Current Report-rule proposal defers TDS; retain the same four reference sensors in A and B', 'Proposed; agreement required', 'The simulation can compare Team rule without claiming an installed TDS channel'],
          ['First-station listed equipment plus optional shared reserve', 'phase-one scenario', '1', '-', 'Partial subtotal', 'One initial purchase', vnd(selected.firstStationPlusReserveVnd), `Formula: ${vnd(selected.unitVnd)} + ${vnd(selected.sharedKitVnd)} shared pH kit; no recurring services included`, 'Payer unconfirmed', `All three stations plus one shared reserve would be ${vnd(selected.threeStationsPlusReserveVnd)} VND, still not a complete budget`],
        ],
      },
    },
    {
      id: 'funding',
      title: 'Affordability and uncertainty',
      paragraphs: [
        {
          text: "No controller has demonstrated lower OPEX: sensors, calibration and services are held equal. A Viettel 30-day plan needs 99 cycles in the dated example. Render's compute-only example is USD13 per shared system-month before storage and usage. The separate Table 4b scenario uses these rates for comparison only. Funding, site access and 48-hour repair capacity are unconfirmed. Equipment is purchased once; lifecycle cost also requires quoted services and replacements.",
          citations: [reference('lilygo-controller'), reference('waveshare-full-modem-kit'), reference('hshop-esp32'), reference('hshop-sim7600'), reference('viettel-iot-plan'), reference('render-hosting-price'), reference('dat-maintenance-response')],
        },
      ],
      table: {
        id: 'controller-comparison',
        caption: 'Table 4a. Listed equipment portions with identical reference sensors, checked 28 November 2026; USD and VND are separate amounts to be added after a stated conversion, not alternative prices',
        wide: true,
        scrollHint: 'Scroll horizontally to compare all six columns. Power, installation and services remain unpriced.',
        columns: ['Configuration', 'One station: VND portion', 'One station: USD portion', 'Three stations: VND portion', 'Three stations: USD portion', 'Package limits'],
        rows: currentCostComparisonRows,
      },
    },
    {
      id: 'reference-additions',
      title: 'Reference additions and remaining costs',
      paragraphs: [{
        text: `Table 4b selects sourced components for a separate planning scenario: ${vnd(additions.perStationAdditionsVnd)} VND per station, plus shared starter fluids. Core equipment, one optional reserve and additions reach ${vnd(additions.hardwareAndStarterVnd)} VND. Adding the dated SIM example and shared compute reaches ${vnd(additions.priced36MonthScenarioVnd)} VND in priced components. Unspecified taxes, freight, protection, mounts, labour, calibration replenishment, hosting storage and replacements remain additional. Power, storage and calibration compatibility are untested; the complete lifecycle total remains unknown.`,
        citations: [reference('giva-panel'), reference('solar-controller'), reference('vac-battery'), reference('e360-buck'), reference('haidang-enclosure'), reference('phongvu-card'), reference('dongbac-ph4'), reference('dongbac-ph7'), reference('mlab-storage'), reference('viettel-iot-plan'), reference('render-hosting-price')],
      }],
      table: {
        id: 'reference-additions-table',
        caption: 'Table 4b. Separate reference scenario: listed unit prices checked 28 November 2026, assumed quantities; not a validated kit or complete budget',
        columns: ['Component', 'Quantity basis', 'Unit / station amount (VND)', 'Project amount (VND)', 'Scope and exclusions'],
        rows: referenceAdditionRows,
        wide: true,
        scrollHint: 'Scroll horizontally for all five columns. Do not add the overlapping scenario totals together.',
      },
    },
  ],
} satisfies ReportSection;
