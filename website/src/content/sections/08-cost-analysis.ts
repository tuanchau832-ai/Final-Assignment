import type { ReportSection } from '../types';
import { references } from '../references';

const reference = (id: string) => references.find((item) => item.id === id)!;

export default {
  title: 'Cost analysis',
  label: 'Cost analysis',
  summary: 'Candidate unit prices for the three-station, three-year working scope; shared maintenance routes and unquoted services are identified separately.',
  topics: [
    {
      id: 'cost-scope',
      title: 'Costing scope and assumptions',
      paragraphs: [
        {
          text: 'This register is a one-station, 12-month unit-cost reference for a proposed three-station, three-year pilot, not an agreed rollout budget. Readings and locations remain simulated. It prices candidate pH, dissolved oxygen (DO), turbidity and temperature hardware; final models and the three-year cost basis still require reconciliation with the team submissions.',
          citations: [reference('hww-blueprint')],
        },
        {
          text: 'The working procurement plan tests one station before ordering the other two after acceptance and a refreshed quotation. Listed equipment is 13,895,466 VND for the first station and 27,790,932 VND for the next two, totalling 41,686,398 VND. These are historical-price subtotals, excluding unquoted equipment, installation and services. Staggered commissioning requires a decision on a common project end date versus three operating years for each station before SIM, hosting and maintenance quantities can be finalised.',
        },
        {
          text: 'Prices were checked on 19 November 2026. A supplier-listed price is an online listing, not a quotation. USD prices use 25,940 VND/USD; freight, import and exchange fees are excluded. VAT and delivery are included only where stated. "Quote required" identifies essential scope without a selected public price. Permission, civil works, insurance, flood and vandalism damage are outside this register.',
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
          citations: [reference('dfrobot-ph'), reference('hshop-do')],
        },
        {
          text: 'This candidate BOM uses RS485 fluorescence DO and industrial turbidity sensors. Teammate proposals use different hardware; their USD totals cannot be substituted without model and interface checks. If an integrated ESP32/4G board is selected, replace the separate board and modem rows and recheck included antennas, charging, sensor interfaces and power compatibility.',
          citations: [reference('hshop-do'), reference('dfrobot-turbidity'), reference('hshop-temperature'), reference('hshop-sim7600')],
        },
        {
          text: 'Dat confirmed six-month functional checks at months 6, 12, 18, 24, 30 and 36, including routine cleaning, calibration checks and a test alert. His proposed quotation basis groups all three stations into one route each time: six shared route visits covering 18 station checks over three years. The month-36 route includes the wear and corrosion review; replacement remains condition-based. Extra cleaning is triggered by drift or suspected fouling, while model-specific calibration requirements remain unresolved. Route feasibility, numerical acceptance thresholds, named testers and service prices still require confirmation.',
        },
        {
          text: 'Six shared testing trips are a full-rollout planning baseline, not the complete priced calibration schedule. The SEN0710 manufacturer page recommends recalibration every 90 days; additional calibration work and travel require a model-specific service quotation. Reference-instrument comparison near alert thresholds is also required before approving the next two stations. A TDS channel remains conditional on the field alert rule selected by the design team, with no selected price.',
          citations: [reference('dfrobot-turbidity')],
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
          ['4G data plan', 'month', '12', 'Quote required', 'OPEX', 'monthly', 'Not included', 'Carrier, data volume, coverage and SIM registration not selected', 'TBD by team', 'Review coverage at authorised site'],
          ['Managed hosting and database', 'month', '12', 'Quote required', 'OPEX', 'monthly', 'Not included', 'Production host, retention and support level not selected', 'TBD by team', 'Obtain annual invoice or supplier quotation'],
          ['Triggered cleaning and additional model-required calibration', 'service', 'TBD', 'Quote required', 'OPEX', 'Between scheduled checks, as needed', 'Not included', 'Dat PR response reviewed 27 Nov 2026: routine cleaning and calibration checks are included in testing; extra work depends on drift, suspected fouling and final datasheets', 'Proposed; agreement required', 'No separate 24/26 cleaning visits or 12 monthly calibrations in the new costing basis'],
          ['Shared pilot testing route: all three stations, cleaning and calibration checks', 'three-station route visit', '2 routes/year; 6 over three years', 'Quote required', 'Shared pilot OPEX', 'Every six months', 'Not included', 'Dat PR #3 comment 7202126238: six proposed shared routes cover 18 station checks; labour, travel, standards, materials and collection must be itemised', 'Proposed; agreement required', 'Shared group cost, not a per-station rate; route feasibility, tester, thresholds and record location pending'],
          ['Month-36 wear and corrosion review', 'station review within final route', '3 reviews across the pilot', 'Included in unquoted testing scope', 'Lifecycle scope memo', 'With month-36 testing', 'Not priced separately', 'Dat confirms review is bundled into the final testing route; no additional scheduled trip or duplicate full-review fee', 'Proposed; agreement required', 'Parts and replacement labour outside the package need separate approval and prices; no blanket replacement'],
          ['Unscheduled repair and power-system maintenance', 'service', 'TBD', 'Quote required', 'OPEX', 'As needed; 48-hour repair requirement', 'Not included', 'Dat requires restoration within 48 hours from fault receipt by the operating team; actual capacity and contractual SLA are unverified', 'Proposed; agreement required', 'Name operator and escalation owner; quote event travel, labour and DO/pH parts separately'],
          ['Optional pH kit reserve shared by the pilot', 'shared kit', '1 across up to three stations', '1,683,506', 'Optional shared reserve', 'Once, not per station or year', '1,683,506', 'Same historical DFRobot USD 64.90 x 25,940; Tuan proposes a shared reserve; this is not a verified spare-probe price', 'Proposed; agreement required', 'Confirm compatibility, storage, replenishment and 48-hour access; do not pay again for the same kit when used'],
          ['DO film/sensor replacement', 'year', '1', 'Quote required', 'Lifecycle', 'at about 12 months', 'Not included', 'One-year film life stated, but no accessible replacement price', 'TBD by team', 'Obtain consumable or repair quotation before approval'],
          ['End-of-life collection and disposal', 'station', '1', 'Quote required', 'Lifecycle', 'at pilot close', 'Not included', 'Licensed e-waste and probe disposal route not selected', 'TBD by team', 'Confirm compliant collection route'],
          ['Reference-instrument hire, loan or verification service', 'service', 'TBD', 'Quote required', 'Pilot acceptance', 'Before ordering the next two stations', 'Not included', 'Compare candidate DO and turbidity probes near alert limits; availability, reference uncertainty and fee unconfirmed', 'Proposed; agreement required', 'A potential loan is not an arranged free service'],
          ['Conditional TDS channel for field alert rule', 'device and calibration', 'TBD', 'Quote required', 'Conditional CAPEX/OPEX', 'Only if the selected rule requires it', 'Not included', 'No selected SKU or price; quote both controller alternatives on the same sensor scope', 'Proposed; agreement required', 'Resolve the field rule before declaring the hardware BOM complete'],
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
        },
        {
          text: 'Before approval, obtain two written quotations for the power system, modem carrier and antennas, outdoor installation, calibration, field visits, SIM data, hosting, DO-film replacement and disposal. Complete load, shading, site, signal and safety surveys, then update the table and evidence register. This keeps the pilot testable while costs remain incomplete.',
          citations: [reference('hww-blueprint'), reference('dfrobot-ph'), reference('hshop-do'), reference('hshop-sim7600')],
        },
      ],
    },
  ],
} satisfies ReportSection;
