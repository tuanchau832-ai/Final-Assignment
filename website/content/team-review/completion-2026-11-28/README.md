# Local Cost Analysis verification — 28/11/2026

Checked the final local content on `feature/ba-nguyen-cost-analysis` using headless Chrome. [Machine-readable cases and screenshot SHA256 hashes](browser-results.json).

| Check | Result |
| --- | --- |
| Viewports | 320, 390, 768, 1024, 1440 px: pass |
| Equipment table | Ten columns, horizontal scroll reaches final column, no page overflow: pass |
| Controller comparison | Six columns, generated native-currency figures, horizontal scroll reaches final column: pass |
| Navigation | Mobile report menu and References: pass |
| Five new citations | FIT0348, LILYGO, Waveshare, Viettel and Render resolve to the correct bibliography entries and source links: pass |
| Large text | 200% root font size at 390 and 1440 px, no page overflow: pass |
| Runtime errors | None observed |

The first six screenshots show each table at 390/1440 px and its right edge at 390 px. This is viewport/touch emulation, not a physical phone test or verification of a hosted deployment. The local React site has no calculator; the separate Tuấn `ea4cce0a` source calculator was checked in the [earlier report](../tuan-ea4cce0a-check-2026-11-28.md). No claim is made that Tuấn's branch or the deployed site includes this turn's new content.

A further two screenshots and four viewport cases verify the Q190 patch on an isolated copy of Tuan ea4cce0a. Both the seven-line BOM and cards show 13,933,146 / 27,866,292 / 1,683,506 / 43,482,944 VND. Three new references were checked with search. The original source copy and teammate branch remain unchanged.
