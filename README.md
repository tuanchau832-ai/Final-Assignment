# CITP Task 3 project introduction and design report

> **Bá Nguyên — cost review package, 28 November 2026:** [Current figures, new source evidence and integration patches](website/content/publication-handoff-2026-11-28.md). This branch carries the handoff; main/final-website and the hosted site are not automatically updated.


This React, TypeScript and Vite site is the draft introduction and report for Hanoi Water Watch. It is a static, client-side application and can be built and hosted independently from the [HanoiWaterWatch application](../HanoiWaterWatch/README.md).

## Run locally

Use Node.js 22.12 or later. Run these commands from the Git repository root.

```sh
cd website
npm ci
npm run dev
```

Open the URL printed by Vite. Run the checks before previewing the production build.

```sh
npm run check:links
npm run build
npm run preview
```

## Report requirements

The route map in [architecture.md](../docs/website/architecture.md) follows the narrative and section list in the [restructure brief](../WEBSITE_RESTRUCTURE_PROMPT.md). The Task 3 rubric, website template, report skeleton, and agreed reverse brief were unavailable in this checkout. Confirm the scaffold against those originals when they are available.

- **Content and stakeholder consideration (50%)** covers sourced Hanoi context and stakeholder needs, measurable criteria, three options and a documented selection, detailed design and prototype evidence, implementation, lifecycle costs, community considerations, and recommendations.
- **Website design and audience engagement (30%)** covers responsive and keyboard-accessible navigation, a clear reading sequence, plain English, and numbered, captioned figures and tables.
- **Referencing, citations and prompts (20%)** covers APA in-text citations and bibliography, source credits for figures and prices, an AI use or non-use declaration, and the supporting prompts, outputs, and screenshots.

Keep the report within **4,000 words**, excluding only ancillary material permitted by the official template. Record each section’s final copy count and check the combined count against the template before submission. The draft placeholders and helper guidance are outside the final copy.

## Report section assignments

Each team member is responsible for drafting their assigned sections and documenting the sources they use.

1. **Ngân — Overview, background, and criteria.** Confirm the team and client details, find sources on the Hanoi context, document stakeholder needs, and turn those needs into measurable design criteria. [Overview](src/content/sections/01-project-details.ts) · [Background](src/content/sections/02-background.ts) · [Problem and criteria](src/content/sections/03-problem-criteria.ts)
2. **Akai — Design options and detailed design.** Compare Hanoi Water Watch, citizen reports, and an AI-driven digital twin. Complete the decision matrix with weights that total **100%**, cite the evidence behind each score, and prepare the system diagram. [Design options](src/content/sections/04-design-options.ts) · [Detailed design](src/content/sections/05-detailed-design.ts)
3. **Đạt — Prototyping and implementation.** Prepare prototype illustrations, document the test method and results with supporting evidence, and outline the pilot plan and operating responsibilities. Label simulations, measured results, and proposed milestones clearly. [Prototyping](src/content/sections/06-prototyping.ts) · [Implementation](src/content/sections/07-implementation.ts)
4. **Bá Nguyên — Cost analysis.** Confirm the equipment list with Akai and the implementation plan with Đạt. Document purchase, operating, maintenance, and replacement costs, including quantities, unit prices, price sources, dates checked, and who pays. [Cost analysis](src/content/sections/08-cost-analysis.ts)
5. **Thư — Impacts and recommendations.** Summarise community concerns, accessibility, environmental impacts, and data governance responsibilities. Use the test results and cost analysis to recommend next steps, identify who would lead them, and state what needs to be in place first. [Other considerations](src/content/sections/09-considerations.ts) · [Recommendations](src/content/sections/10-recommendations.ts)
6. **Tuấn — References, appendices, and editing.** Standardise APA citations, check the sources behind figures and data, and compile the reverse brief, AI use or non-use records, and actual team contributions. Check the **4,000-word** limit against the official template. [References](src/content/references.ts) · [Appendices](src/content/appendices.ts)

Agree on the design criteria as a team before scoring the options. Đạt and Bá Nguyên can gather test evidence and price quotes in parallel. Thư uses both sets of findings to write the recommendations. Each team member opens a pull request for their assigned sections, sends their sources and evidence to Tuấn, and keeps `[FILL: …]` wherever evidence is pending. [Contribution guide](TEAM_README.md)

## Deploy the report separately

In Vercel, import the GitHub repository as a project with Root Directory **`website`** and the Vite preset. Use Node.js 22.12+ (or a supported newer release), install with `npm ci`, build with `npm run build`, and publish `dist`. [vercel.json](vercel.json) sends direct report URLs and browser refreshes to the React Router entrypoint. The other application can use its own project and domain, with `HanoiWaterWatch/` as its build context and its existing container and database setup. [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite)

Set the public `VITE_HANOI_WATER_WATCH_URL` in Vercel to the verified HTTPS application URL and redeploy. For local development, copy [.env.example](.env.example) to `.env.local` and set the same variable. Development also accepts HTTP loopback addresses for testing against a locally running application. Vite embeds the value at build time. With no valid URL, the launch control displays **Application link pending**.

**Submission platform approval required.** The restructure brief records a Google Sites requirement in the assignment template. Confirm approval for a Vercel submission with teaching staff before using it for assessment.

See the [team handoff](TEAM_README.md), [release checklist](../docs/website/release-checklist.md), and [verification checklist](tests/checklist.md).
