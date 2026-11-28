import type { ReportSection } from '../types';
import { references } from '../references';

const reference = (id: string) => references.find((item) => item.id === id)!;

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
          text: 'This register prices candidate pH, dissolved oxygen (DO), turbidity and temperature hardware for up to three stations within one 36-month project from the first commissioning. It is not an approved budget. Readings and locations remain simulated. Final hardware, authorised sites, actual start dates and written quotations remain pending.',
          citations: [reference('hww-blueprint')],
        },
        {
          text: 'The working plan tests one station before ordering two more after acceptance and a refreshed quotation. Listed equipment is 13,895,466 VND for the first and 27,790,932 VND for the next two, totalling 41,686,398 VND. These historical-price subtotals exclude unquoted equipment, installation and services. Tuan adopted a common 36-month costing horizon: illustrative starts at months 0/6/6 give 96 SIM-months, 36 shared hosting months and 16 station checks in six scheduled rounds. Actual commissioning dates remain unconfirmed.',
          citations: [reference('tuan-first-station-plan')],
        },
        {
          text: 'The unit-price register retains prices checked on 19 November 2026, with subsequent evidence reviews dated separately. A supplier-listed price is an online listing, not a quotation. USD calculations retain the historical 25,940 VND/USD basis. On 27 November, the NDH live table still displayed this figure in its 19 November Vietcombank selling-rate row; it is not a current bank quotation. Freight, import and exchange fees are excluded. VAT and delivery are included only where stated. "Quote required" identifies essential scope without a selected public price. Permission, civil works, insurance, flood and vandalism damage remain uncosted.',
          citations: [reference('vietcombank-rate'), reference('hshop-esp32'), reference('hshop-do'), reference('hshop-sim7600')],
        },
      ],
    },
    {
      id: 'lifecycle-cost',
      title: 'Lifecycle cost schedule',
      paragraphs: [
        {
          text: 'Table 4 separates supplier-listed prices from items requiring a quotation. Its 13,895,466 VND procurement subtotal includes only numeric supplier-listed rows. It excludes the final enclosure, waterproofing, solar system, SIM7600 carrier and LTE antenna, site work, installation, commissioning and training. The 305,000 VND Viger listing is a price reference because its size is not selected.',
          citations: [reference('dfrobot-ph'), reference('hshop-do'), reference('dfrobot-turbidity'), reference('hshop-temperature'), reference('hshop-rs485'), reference('vinadenki-enclosure'), reference('daihoaphu-gland')],
        },
        {
          text: 'The manufacturer states pH life exceeds 4,380 hours, depending on water quality; this is not a fixed six-month replacement deadline. The current optional reserve scenario holds one full pH kit shared across the pilot, costing 1,683,506 VND once. First-station listed procurement plus that shared reserve is 15,578,972 VND; all three stations plus the shared reserve is 43,369,904 VND. Storage, compatibility, replenishment and access within the 48-hour repair requirement remain unconfirmed. Calibration, DO-film replacement, field work, connectivity, hosting, power maintenance and disposal remain unpriced.',
          citations: [reference('dfrobot-ph'), reference('dfrobot-do-specifications'), reference('tuan-first-station-plan')],
        },
        {
          text: 'This candidate BOM uses RS485 fluorescence DO and industrial turbidity sensors. Teammate proposals use different hardware; their USD totals cannot be substituted without model and interface checks. If an integrated ESP32/4G board is selected, replace the separate board and modem rows and recheck included antennas, charging, sensor interfaces and power compatibility.',
          citations: [reference('hshop-do'), reference('dfrobot-turbidity'), reference('hshop-temperature'), reference('hshop-sim7600')],
        },
        {
          text: 'Dat confirmed six-month functional checks including routine cleaning, calibration checks and a test alert. Eighteen station checks in six rounds applies when all three start together. With starts at 0/6/6 and a common month-36 close, the rounds cover 1/3/3/3/3/3 stations: 16 checks. Closeout wear reviews cover all three, but only the first has reached 36 months of service; the others are 30 months old. Replacement is condition-based and faults are handled earlier. Route feasibility, approved acceptance limits, named operators and service prices remain pending.',
          citations: [reference('dat-maintenance-response'), reference('tuan-first-station-plan')],
        },
        {
          text: 'Request monthly SEN0169-V2 pH calibration and SEN0710 recalibration within 90 days, separately from initial calibration. For the 0/6/6 example, monthly pH work totals 96 station tasks, including 16 potentially bundled with testing and 80 outside it. An illustrative dated worksheet gives 32 turbidity tasks before any early rescheduling; 90 days is not always three calendar months. Tasks are not trips: suppliers must confirm dates, included labour and supplies, and avoid duplicate charges. The first-station proposal uses the Report rule for internal alerts and defers TDS; Team rule and field acceptance still need technical approval.',
          citations: [reference('dfrobot-turbidity'), reference('dfrobot-ph-calibration'), reference('tuan-first-station-plan')],
        },
      ],
      table: {
        id: 'cost-schedule',
        caption: 'Table 4. Candidate unit prices and first-station partial subtotal; shared pilot services and reserve are labelled separately (VND)',
        wide: true,
        scrollHint: 'Scroll horizontally to view all ten cost columns.',
        columns: ['Item and specification', 'Unit', 'Quantity', 'Unit cost', 'Cost type', 'Frequency', 'Subtotal', 'Price basis, source URL and date', 'Proposed payer', 'Maintenance / end-of-life'],
        rows: [
          ['ESP-WROOM-32E development board (Vietduino ESP32)', 'each', '1', '195,000', 'Supplier-listed CAPEX', 'once', '195,000', 'Hshop current sale listing; VAT stated; delivery not stated; checked 19 Nov 2026', 'TBD by team', 'Keep one spare only after acceptance'],
          ['Industrial pH meter kit V2, 24/7 electrode (SEN0169-V2)', 'each', '1', '1,683,506', 'Supplier-listed CAPEX', 'once', '1,683,506', 'DFRobot list price USD 64.90 x 25,940; freight, import and exchange fees excluded; checked 19 Nov 2026', 'TBD by team', 'Manufacturer states >4,380-hour life; spare-probe price not verified'],
          ['RS485 fluorescence DO probe, freshwater, IP68 (SEN0680)', 'each', '1', '4,428,000', 'Supplier-listed CAPEX', 'once', '4,428,000', 'Hshop listing, VAT stated; delivery not stated; checked 19 Nov 2026', 'TBD by team', 'Film life stated as about one year; replacement quotation required'],
          ['Industrial RS485 turbidity sensor, 0-1,000 NTU (SEN0710)', 'each', '1', '5,940,260', 'Supplier-listed CAPEX', 'once', '5,940,260', 'DFRobot list price USD 229.00 x 25,940; freight, import and exchange fees excluded; checked 19 Nov 2026', 'TBD by team', 'Inspect for fouling during authorised visits'],
          ['Waterproof DS18B20 temperature probe', 'each', '1', '35,000', 'Supplier-listed CAPEX', 'once', '35,000', 'Hshop listing, VAT stated; delivery not stated; checked 19 Nov 2026', 'TBD by team', 'Validate wastewater compatibility before field use'],
          ['TTL-to-RS485 converter for shared sensor bus', 'each', '1', '35,000', 'Supplier-listed CAPEX', 'once', '35,000', 'Hshop listing, VAT stated; delivery not stated; checked 19 Nov 2026', 'TBD by team', 'Test after cable changes'],
          ['SIM7600G-H-M.2 4G LTE module only', 'each', '1', '1,566,000', 'Supplier-listed CAPEX', 'once', '1,566,000', 'Hshop listing, VAT stated; module only; checked 19 Nov 2026', 'TBD by team', 'Carrier, LTE antenna set, power path and integration test are separate quote-required items'],
          ['Viger ABS IP65 enclosure (candidate price reference)', 'each', 'TBD', '305,000', 'Price reference only', 'once', 'Not included', 'Vinadenki listing; VAT excluded; nationwide delivery stated but charge not stated; checked 19 Nov 2026', 'TBD by team', 'Exact model and size are not selected, so this price is not included in a subtotal'],
          ['PG13.5 cable gland (cable diameter to confirm)', 'each', '4', '3,175', 'Supplier-listed CAPEX', 'once', '12,700', 'Dai Hoa Phu price after 8% VAT; delivery not stated; checked 19 Nov 2026; page rechecked 25 Nov', 'TBD by team', 'Listing says 7–12 mm near price but 6–12 mm in details; confirm fit and count against final cable schedule'],
          ['Listed-price procurement subtotal - not total CAPEX', 'station', '1', '-', 'Partial subtotal', 'once', '13,895,466', 'Formula: numeric supplier-listed procurement rows only', 'TBD by team', 'Excludes all quote-required rows below and the unselected enclosure reference'],
          ['Selected enclosure, cable entries and waterproofing', 'system', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'Choose dimensions, material, cable entries and seals after the equipment layout and site survey', 'TBD by team', 'Quote must state model, IP rating, VAT, delivery, penetrations and warranty'],
          ['Solar panel, battery, charge controller and regulated supply', 'system', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'No selected panel/battery capacity or current complete-kit price; size after load and shading survey', 'TBD by team', 'Quote must state panel, battery, controller, converter, protection and warranty'],
          ['SIM7600 M.2 carrier, LTE antenna set and regulated modem supply', 'set', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'Current module listing names M.2 B-key and IPEX-4 interfaces but does not supply the carrier or antennas', 'TBD by team', 'Validate UART, voltage, current peaks, antenna connectors and network coverage'],
          ['Outdoor cable, connectors, sensor rack and mounting hardware', 'site set', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'Cable lengths, connector types, corrosion grade and mounting method depend on authorised site survey', 'TBD by team', 'Record final cable schedule and grounding approach'],
          ['Installation, commissioning and initial calibration', 'service', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'No public, site-specific contractor quote', 'TBD by team', 'Requires authorised access, acceptance checks and calibration records'],
          ['Operator training and deployment preparation', 'service', '1', 'Quote required', 'CAPEX', 'once', 'Not included', 'Training scope, provider and participants unconfirmed', 'TBD by team', 'Handover record and refresher scope need confirmation'],
          ['4G data plan', 'SIM-month', '96 pilot example; 108 simultaneous', 'Quote required', 'Pilot OPEX', 'monthly while active', 'Not included', 'Common month-36 close; 0/6/6 example gives 24/36/36 SIM-months in years 1/2/3; actual start dates and billing terms pending', 'TBD by team', 'One SIM per active station; no SIM billed before commissioning in this model'],
          ['Managed hosting and database', 'system-month', '36 shared', 'Quote required', 'Shared pilot OPEX', 'monthly from first station', 'Not included', 'One shared backend; retention, support and per-device or usage charges need quotation', 'TBD by team', 'Do not multiply shared hosting by three stations'],
          ['Monthly pH calibration, excluding commissioning', 'station task', '96 example: 16 testing + 80 outside', 'Quote required', 'Pilot OPEX', 'monthly while active', 'Not included', 'Monthly RFQ policy based on DFRobot guidance; bundled work must actually include the full calibration and supplies', 'Proposed; agreement required', 'This replaces the old unsupported cleaning-cost scenario; it does not reinstate its prices'],
          ['SEN0710 recalibration, excluding commissioning', 'station task', '32 dated-example tasks before rescheduling', 'Quote required', 'Pilot OPEX', 'within 90 days of last calibration', 'Not included', 'Worksheet uses illustrative 1 Jan 2027 origin, not a selected deployment date; early bundling resets the next deadline', 'Proposed; agreement required', 'Do not treat three calendar months as 90 days or station tasks as travel visits'],
          ['Triggered cleaning and event calibration', 'service', 'TBD by condition', 'Quote required', 'Pilot OPEX', 'when drift, fouling or repair requires it', 'Not included', 'Keep separate from priced routine calibration and testing inclusions', 'Proposed; agreement required', 'No double charge for work already included in a scheduled package'],
          ['Shared pilot testing rounds: cleaning, calibration checks and alert test', 'route round', '6 example rounds covering 16 station checks', 'Quote required', 'Shared pilot OPEX', 'each station every six months', 'Not included', '0/6/6 illustration: round 6 checks only ST-01; rounds 12/18/24/30/36 check all three; 18 checks is the simultaneous-start comparison', 'Proposed; agreement required', 'Quote the actual route scope; adding commissioning work for ST-02/03 at month 6 must be itemised separately'],
          ['Project-close wear and corrosion review', 'station review within final round', '3 closeout reviews; only 1 at age 36 in example', 'Included in unquoted testing scope', 'Lifecycle scope memo', 'at common project month 36', 'Not priced separately', 'ST-02/03 are age 30 with 0/6/6 starts; closing the project does not make them 36 months old', 'Proposed; agreement required', 'No extra trip or duplicate review fee; condition-based parts and replacement labour require quotes'],
          ['Unscheduled repair and power-system maintenance', 'service', 'TBD', 'Quote required', 'OPEX', 'As needed; 48-hour repair requirement', 'Not included', 'Dat requires restoration within 48 hours from fault receipt by the operating team; actual capacity and contractual SLA are unverified', 'Proposed; agreement required', 'Name operator and escalation owner; quote event travel, labour and DO/pH parts separately'],
          ['Optional pH kit reserve shared by the pilot', 'shared kit', '1 across up to three stations', '1,683,506', 'Optional shared reserve', 'Once, not per station or year', '1,683,506', 'Same historical DFRobot USD 64.90 x 25,940; Tuan proposes a shared reserve; this is not a verified spare-probe price', 'Proposed; agreement required', 'Confirm compatibility, storage, replenishment and 48-hour access; do not pay again for the same kit when used'],
          ['DO film/sensor replacement', 'year', '1', 'Quote required', 'Lifecycle', 'at about 12 months', 'Not included', 'One-year film life stated, but no accessible replacement price', 'TBD by team', 'Obtain consumable or repair quotation before approval'],
          ['End-of-life collection and disposal', 'station', '1', 'Quote required', 'Lifecycle', 'at pilot close', 'Not included', 'Licensed e-waste and probe disposal route not selected', 'TBD by team', 'Confirm compliant collection route'],
          ['Reference-instrument hire, loan or verification service', 'service', 'TBD', 'Quote required', 'Pilot acceptance', 'Before ordering the next two stations', 'Not included', 'Compare candidate DO and turbidity probes near alert limits; availability, reference uncertainty and fee unconfirmed', 'Proposed; agreement required', 'A potential loan is not an arranged free service'],
          ['TDS extension for a future Team-rule trial', 'device and calibration', 'Excluded from first-station proposal', 'Quote required if added', 'Conditional CAPEX/OPEX', 'Only after design approval', 'Not included', 'Current Report-rule proposal defers TDS; retain the same four reference sensors in A and B', 'Proposed; agreement required', 'The simulation can compare Team rule without claiming an installed TDS channel'],
          ['First-station listed equipment plus optional shared reserve', 'phase-one scenario', '1', '-', 'Partial subtotal', 'One initial purchase', '15,578,972', 'Formula: 13,895,466 + 1,683,506 shared pH kit; no recurring services included', 'TBD by team', 'All three stations plus one shared reserve would be 43,369,904 VND, still not a complete budget'],
        ],
      },
    },
    {
      id: 'funding',
      title: 'Affordability and uncertainty',
      paragraphs: [
        {
          text: 'No full-station or monthly affordability figure is claimed because essential equipment and services remain unpriced. Dat requires upfront agreements involving the Department of Agriculture and Environment, the operating team and suppliers; no signed funding allocation or service commitment has been supplied. Payers remain proposed until each cost and responsibility is agreed. No community fee is assumed.',
          citations: [reference('dat-maintenance-response')],
        },
        {
          text: 'Before approval, obtain two written quotations for the power system, modem carrier and antennas, outdoor installation, calibration, field visits, SIM data, hosting, DO-film replacement and disposal. Complete load, shading, site, signal and safety surveys, then update the table and evidence register. This keeps the pilot testable while costs remain incomplete.',
          citations: [reference('hww-blueprint'), reference('dfrobot-ph'), reference('hshop-do'), reference('hshop-sim7600')],
        },
      ],
    },
  ],
} satisfies ReportSection;
