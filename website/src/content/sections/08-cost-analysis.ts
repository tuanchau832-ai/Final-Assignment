import type { ReportSection } from '../types';
import { references } from '../references';

const reference = (id: string) => references.find((item) => item.id === id)!;

export default {
  title: 'Cost analysis',
  label: 'Cost analysis',
  summary: 'A one-station candidate price register. The final hardware, rollout scope and complete pilot budget remain subject to review.',
  topics: [
    {
      id: 'cost-scope',
      title: 'Costing scope and assumptions',
      paragraphs: [
        {
          text: 'This register is a one-station, 12-month unit-cost reference, not an agreed rollout budget. Readings and locations remain simulated. It prices candidate pH, dissolved oxygen (DO), turbidity and temperature hardware; final models, station count and evaluation period require reconciliation with the team submissions.',
          citations: [reference('hww-blueprint')],
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
          text: 'The manufacturer states pH life exceeds 4,380 hours, depending on water quality; this is not a fixed six-month replacement deadline. One conservative full-kit reserve makes the 12-month listed-price subtotal 15,578,972 VND. Calibration, DO-film replacement, field work, connectivity, hosting, power maintenance and disposal remain unpriced.',
          citations: [reference('dfrobot-ph'), reference('hshop-do')],
        },
        {
          text: 'This candidate BOM uses RS485 fluorescence DO and industrial turbidity sensors. Teammate proposals use different hardware; their USD totals cannot be substituted without model and interface checks. If an integrated ESP32/4G board is selected, replace the separate board and modem rows and recheck included antennas, charging, sensor interfaces and power compatibility.',
          citations: [reference('hshop-do'), reference('dfrobot-turbidity'), reference('hshop-temperature'), reference('hshop-sim7600')],
        },
      ],
      table: {
        id: 'cost-schedule',
        caption: 'Table 4. One-station physical-pilot price register and 12-month costed subtotal (VND)',
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
          ['Calibration, cleaning and field inspection', 'service schedule', 'TBD', 'Quote required', 'OPEX', 'Proposed: fortnightly cleaning; monthly calibration', 'Not included', 'Dat proposes cleaning every two weeks but budgets 24 visits/year; a full 52-week schedule is about 26. Monthly calibration is 12/year; confirm overlap, travel and labour', 'TBD by team', 'Agree 24 twice-monthly or about 26 fortnightly visits; add post-flood inspections separately'],
          ['Routine maintenance, repair and power-system maintenance', 'year', '1', 'Quote required', 'OPEX', 'annual', 'Not included', 'No field failure history or selected power system', 'TBD by team', 'Separate minor repair from major replacement approval'],
          ['pH kit re-purchase provision (conservative, full-kit price)', 'each', '1', '1,683,506', 'Lifecycle priced provision', 'One reserve within 12 operating months', '1,683,506', 'Same DFRobot USD 64.90 x 25,940; this is not a verified spare-probe price or a manufacturer-mandated six-month schedule', 'TBD by team', 'Confirm replacement on condition and supplier advice; recalibrate after replacement'],
          ['DO film/sensor replacement', 'year', '1', 'Quote required', 'Lifecycle', 'at about 12 months', 'Not included', 'One-year film life stated, but no accessible replacement price', 'TBD by team', 'Obtain consumable or repair quotation before approval'],
          ['End-of-life collection and disposal', 'station', '1', 'Quote required', 'Lifecycle', 'at pilot close', 'Not included', 'Licensed e-waste and probe disposal route not selected', 'TBD by team', 'Confirm compliant collection route'],
          ['12-month listed-price subtotal - not full pilot cost', 'station', '1', '-', 'Partial subtotal', '12 months', '15,578,972', 'Formula: 13,895,466 + 1,683,506 pH re-purchase provision', 'TBD by team', 'Do not use for affordability, procurement approval or funding commitment'],
        ],
      },
    },
    {
      id: 'funding',
      title: 'Affordability and uncertainty',
      paragraphs: [
        {
          text: 'No full-station or monthly affordability figure is claimed because essential equipment and services remain unpriced. Funding is proposed only: a university, grant or sponsor could fund approved procurement, while the site owner and operator would agree access, inspections, connectivity, incident response and support. No community fee is assumed.',
        },
        {
          text: 'Before approval, obtain two written quotations for the power system, modem carrier and antennas, outdoor installation, calibration, field visits, SIM data, hosting, DO-film replacement and disposal. Complete load, shading, site, signal and safety surveys, then update the table and evidence register. This keeps the pilot testable while costs remain incomplete.',
          citations: [reference('hww-blueprint'), reference('dfrobot-ph'), reference('hshop-do'), reference('hshop-sim7600')],
        },
      ],
    },
  ],
} satisfies ReportSection;
