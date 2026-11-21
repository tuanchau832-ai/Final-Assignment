# Cost-analysis handoff for Tuan

Prepared by: Ba Nguyen  
Date: 19 November 2026  
Scope: one proposed physical Hanoi Water Watch station; this is not the simulated prototype cost.

## What changed

- Rechecked every existing priced item on its direct product page.
- Corrected the ESP32 list price from 265,000 VND to the current displayed sale price of 195,000 VND.
- Retained the SIM7600G-H-M.2 module at 1,566,000 VND, but removed any implication that it is a complete cellular solution. The M.2 carrier, LTE antenna set, regulated supply and integration test remain unpriced.
- Replaced internal service allowances with `Quote required`; no unsupported service number is included in a total.
- Added a candidate IP65 enclosure and four cable-gland list prices with their VAT limitations.
- Replaced the former 41,936,272 VND “planning ceiling” with two explicitly partial figures:
  - listed-price procurement subtotal: 13,895,466 VND;
  - 12-month listed-price subtotal: 15,578,972 VND, which adds one conservative pH full-kit re-purchase provision.

Neither number is a complete CAPEX, pilot-cost, affordability, procurement or funding total.

## Files for review

- `website/src/content/sections/08-cost-analysis.ts` - published section and calculations.
- `website/content/cost-price-evidence.csv` - auditable row-by-row price record, tax/delivery note and exclusions.
- `website/content/cost-evidence/README.md` - source manifest and required screenshot filenames for each price record.
- `website/content/evidence-register.csv` - report evidence register entries `cost-001` to `cost-008`.
- `website/src/content/references.ts` - APA-style source entries and direct price URLs.

## Exact quotations still required

1. Selected enclosure, cable entries and waterproofing: the Viger listing has several sizes, so its 305,000 VND price is a reference and is excluded from totals.
2. Complete solar power system: panel, battery, controller, DC conversion, protection, cabling, mount and warranty. Size it only after a load and shading survey.
3. SIM7600 M.2 carrier, LTE antenna set, modem power path and ESP32 integration test.
4. Outdoor cable runs, sensor rack, corrosion-resistant connectors and mounting.
5. Installation, commissioning, initial and recurring calibration, cleaning and authorised field visits.
6. SIM data, production hosting/database, routine maintenance, DO-film replacement and compliant disposal.

Obtain at least two written quotations for each viable critical bundle. Each quote should state model, quantity, VAT, freight, installation inclusions, warranty, lead time and validity date.

## Calculation check

| Check | Result |
| --- | --- |
| Four PG13.5 glands | 4 x 3,175 = 12,700 VND |
| pH conversion | USD 64.90 x 25,940 = 1,683,506 VND |
| Turbidity conversion | USD 229.00 x 25,940 = 5,940,260 VND |
| Listed procurement subtotal | 13,895,466 VND |
| 12-month listed-price subtotal | 13,895,466 + 1,683,506 = 15,578,972 VND |

The candidate enclosure is excluded because its exact variant is unconfirmed. Imported USD-item freight/import/payment costs are not included. Therefore the two subtotals must never be presented as all-in prices.

## Website verification record

| Test | Result | Evidence |
| --- | --- | --- |
| Link check | Pass | `npm.cmd run check:links` verified 12 routes, internal links and missing-page view. |
| Production build | Pass | `npm.cmd run build` completed TypeScript checking and Vite build. |
| LAN development server | Running | `npm.cmd run dev -- --host 0.0.0.0` served `/pages/cost-analysis` at `http://192.168.2.15:5173/pages/cost-analysis`. |
| HTTP route | Pass | Local request returned HTTP 200. |
| Emulated mobile layout | Pass | Chrome CDP emulation at 390 x 844: document width 390 px, no page-level horizontal overflow; table client width 358 px and scroll width 1,200 px. |
| Physical phone test | Pending | Open the LAN URL above from a phone on the same Wi-Fi. Record device, browser, screen size, menu/references-link result and any screenshot of defects. |

## AI-use record

Text assistance was used to structure the cost audit, calculations, wording and evidence tables. No image-generation model was used for this cost-analysis work. The local deliverables above are the text output record. Before submitting course evidence, capture the relevant conversation prompt/output screens from the chat interface and store them outside the public website unless the teaching team specifically requires publication.
