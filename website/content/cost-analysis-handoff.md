# Cost-analysis handoff for Tuan

> **Current handoff, 26 November 2026:** Start with the [final-website versus Ba Nguyen comparison](final-website-vs-ba-nguyen-2026-11-26.md), the [three-station/three-year rollup](cost-rollup-3stations-3years-2026-11-26.md) and its [CSV](cost-rollup-3stations-3years-2026-11-26.csv). Akai confirmed the working scope as 3 stations/3 years. Dat's newer suggestion, relayed by Ba Nguyen, separates six-month functional checks from a year-three wear/corrosion review; cleaning/calibration scope and prices remain pending. The 25 November notes below are historical, including 26 visits and unresolved D1, and do not supersede the update. Latest source review is at final-website commit a85be4e; integration remains unconfirmed. This assigned branch's build does not validate final-website.

Prepared by: Ba Nguyen  
Date: updated 25 November 2026
Scope: one-station candidate unit-cost reference; final rollout scope and hardware are unresolved. This is not the simulated prototype cost.

## Review update — 25 November 2026

- Read the complete Dat DOCX and Akai comparison MD. Detailed findings: [team-confirmation-review-2026-11-25.md](team-confirmation-review-2026-11-25.md); current tasks: [ba-nguyen-work-plan.md](ba-nguyen-work-plan.md).
- Akai uses 3 stations/3 years, whereas Dat and the `final-website` source use 10 stations/1 year. The old one-station register is a unit basis, not an agreed rollout scope. A shared scope and final hardware remain pending.
- Corrected the current Cost Analysis wording to identify candidate hardware and a conservative pH reserve rather than a mandatory six-month replacement deadline. Ba Nguyen has since selected 26 scheduled cleaning/inspection visits per station-year for planning; field service remains quote-required. Historical numeric subtotals below are unchanged and remain partial.
- The final-website summary's approximately USD 6,100 is rounding of USD 6,105.70, not an arithmetic error. The USD 430 heading does not distinguish USD 428.07 equipment/materials from USD 468.07 installed. A patch ties summary/heading/calculator to the same BOM, labels incomplete scenario inputs and supports three stations.
- The patch [team-review/final-website-cost-summary.patch](team-review/final-website-cost-summary.patch) targets source commit `556fb6e92d5f1abc34b70d7711ab5ffd36da25a0`. `page.html/site.ts` do not exist on the assigned branch, so the fix is prepared and tested in a temporary copy, **not integrated into final-website or the hosted site**. No branch switch or merge was performed.
- Checked four manufacturer listings on 25 November; see [team-price-source-checks-2026-11-25.csv](team-price-source-checks-2026-11-25.csv). SEN0189 at USD 9.90 differs from SEN0710 at USD 229. LILYGO family display USD 65.31 does not verify the intended variant or the earlier USD 49.78. No automatic price or exchange-rate substitution was made.
- Reopened the nine direct URLs in the existing price register on 25 November and recorded observed prices/limits in [live-price-audit-2026-11-25.csv](live-price-audit-2026-11-25.csv). The PG13.5 seller page conflicts on 7–12 versus 6–12 mm cable diameter; the website row now flags fit for confirmation while retaining the observed 3,175 VND price. Product-page review is not a supplier quotation.
- Captured and visually checked six clear local product-page screenshots for rows `price-001`, `003`, `005`, `006`, `007` and `008`. Ba Nguyen then supplied four original screenshots from Desktop; exact copies are now archived for `price-002` (SEN0169-V2, USD 64.90), `price-004` (SEN0710, USD 229.00) and two `price-009` views (2,940 VND + 235 VND VAT = 3,175 VND; conflicting 7–12/D6–12 mm cable ranges). Source/destination SHA-256 hashes matched. The older local `price-002` capture is still obscured, but the new copy is clear. See the [manifest](cost-evidence/README.md). These are page evidence, not written supplier quotations.
- Updated the [quote request template](supplier-quote-request-template.md) to keep the LILYGO integrated-board and separate ESP32/M.2 alternatives distinct and request 26 scheduled visits as the main case, with 24 as an optional comparison. The template still needs the final model, site and quantity before it can be sent.
- Created [cost-scenarios-2026-11-25.csv](cost-scenarios-2026-11-25.csv) with formula-labelled provisional 1/3/10-station examples and a 24/26-visit sensitivity, plus [power-sizing-inputs-2026-11-25.csv](power-sizing-inputs-2026-11-25.csv) with blank technical inputs rather than invented load figures.
- Drafted [team-replies-ready-2026-11-25.md](team-replies-ready-2026-11-25.md) for Akai, Dat, Tuan, Thu and the eventual supplier enquiry. No messages were sent by the agent.
- Evidence register updated with findings and explicit pending/patch-only states. Team confirmations are requested in PR #3; no supplier enquiry or private teammate message was sent.

### Verification for this review

| Check | Status / limit |
| --- | --- |
| Patch check and application | Passed on a temporary copy of the exact final-website snapshot; resulting files matched expected changes |
| Summary/heading/calculator logic | Passed with DOM stubs: 1/1, 3/1, 3/3, 10/1, 10/3, 3/5 station/year cases; repeated with board price +USD 1 to check propagation |
| Current React website link check | Passed 25 Nov: `npm.cmd run check:links` verified 12 routes, internal links and missing-page view; this does not test the final-website architecture |
| Current React website production build | Passed 25 Nov: `npm.cmd run build` completed TypeScript and Vite production build; this does not build final-website |
| Review records | CSV column counts/unique IDs and local links in the four review/plan/handoff documents passed |
| Current cost-table arithmetic | Passed 25 Nov: 8 listed procurement rows each satisfy quantity × unit price; both partial subtotal rows match; all 24 table rows have 10 cells |
| Current prose length | 348 whitespace-delimited words excluding table/summary; this is not an official assignment word-count ruling |
| Full final-website build/browser/physical phone | Pending integration and final-source verification |
| Source screenshots, received quotations and AI prompt/output screenshots | All nine price-source rows now have readable local image evidence, using ten clear files because the gland price and specifications are separate images. Quotations and AI prompt/output screenshots are still pending. |

Ba Nguyen's [D5/D7 decision](ba-nguyen-decisions-2026-11-25.md) assigns Tuan to integrate the patch on `final-website` after checking the source and selects 26 scheduled cleaning visits/year/station for planning. This is a coordination decision, not evidence that the patch is applied or field service is priced. Akai, Dat and Tuan still need to resolve D1–D4, D6 and D8; Dat must confirm D5 feasibility and quotations. PR #3 was open and marked ready for review when last checked; no substantive teammate answers were found on its discussion timeline.

Also resolve D8: Akai's comparison uses AI + IoT, whereas final-website option C and its matrix still use manual sampling. Update the option set and have the team reassess scores; do not transfer the manual-sampling scores to AI.

## Historical draft snapshot — 19 November 2026

The following figures and checks describe the earlier draft. They are not new price verifications or evidence that the former development server is still running.

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
| LAN development server | Historical 19 Nov result | The earlier server used `http://192.168.2.15:5173/pages/cost-analysis`; obtain the current IPv4 and Vite port before testing. |
| HTTP route | Pass | Local request returned HTTP 200. |
| Emulated mobile layout | Pass | Chrome CDP emulation at 390 x 844: document width 390 px, no page-level horizontal overflow; table client width 358 px and scroll width 1,200 px. |
| Physical phone test | Pending | Obtain the current LAN URL and open it on the same Wi-Fi. Record device, browser, screen size, menu/references-link result and any screenshot of defects. |

## AI-use record

Text assistance was used to structure the cost audit, calculations, wording and evidence tables. No image-generation model was used for this cost-analysis work. The local deliverables above are the text output record. Before submitting course evidence, capture the relevant conversation prompt/output screens from the chat interface and store them outside the public website unless the teaching team specifically requires publication.
