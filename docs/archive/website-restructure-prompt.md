# Coding Agent Prompt — Restructure CITP Introduction Website Only

**Copy this prompt to your coding agent (e.g. Claude Opus / Codex) while the working directory is `D:\UTSTNE\CITP\Final-Assignment`.**

---

You are a senior frontend architect, documentation engineer and repository-maintenance assistant. Work inside the existing repository:

`D:\UTSTNE\CITP\Final-Assignment`

Repository URL: `https://github.com/tuanchau832-ai/Final-Assignment`.

## Primary objective

**Reconstruct only the information architecture, report narrative flow, navigation and complete directory skeleton for the CITP Task 3 introduction/report website.** The website describes the Hanoi Water Watch design project to a nontechnical client and community audience. It is separate from the **completed** HanoiWaterWatch application and links to that application through an external URL. Both sites will eventually be deployed to two independent domains from the same repository.

**Do not rebuild, refactor, move, rename, delete, overwrite, or modify any file inside `HanoiWaterWatch/`.** Do not reorganize the HWW app's internal backend/frontend/firmware/simulator/3D model. Treat it as a read-only external integration target. Do not assume its implementation or its deployment is identical to a static website.

## Required inputs, in priority order

1. Existing local repo filesystem and tracked Git files: inspect, do not assume prior public GitHub listings match current local state.
2. `website/README.md` — exact Task 3 content requirements and page map (if present; otherwise use the accompanying README file).
3. `website/TEAM_README.md` — collaboration, Git and handoff contract (if present; otherwise use the accompanying TEAM README file).
4. Assignment documents supplied by the user: `31265 HCMUT CITP Rubric for Task 3 Website(1).docx`, `Website template Vietnam-1.docx`, `Hanoi_Water_Watch_Report_Skeleton.docx`, and the agreed reverse brief (if available).
5. Existing `GITHUB_TEAM_WORKFLOW.md` for branch and PR conventions.

**If a file is unavailable, report that limitation and leave labeled placeholders. Never invent rubric requirements, client identity, facts, citations, test results, hardware specifications, prices or working app URLs.**

## Phase 0 — Safe read-only audit, before editing

- Print current branch, `git status --short`, `git ls-files --stage -- HanoiWaterWatch`, `git submodule status` (handle errors), top-level tree (exclude dependencies and secret contents), and identify current site entrypoints / frameworks / possible naming conflicts.
- Explicitly report whether `HanoiWaterWatch` is a regular folder, a nested repository or an orphaned gitlink.
- The repo previously reported `fatal: no submodule mapping found in .gitmodules for path 'HanoiWaterWatch'` plus nested `.git` dubious ownership. **Do not run `safe.directory` globally, delete nested `.git`, convert submodules, force reset/push or rewrite history** as part of this request.
- Avoid opening or printing `.env`, `.env.local` or secrets. Flag any tracked secret-like filenames for maintainer audit.
- Make a concise inventory of **files to preserve**, **files proposed for creation** and **potential conflicts**.
- If new website structure can be added safely, continue without modifying HWW. If a naming/index conflict would risk the app, do not force a destructive change; document the conflict and use a non-conflicting path.

## Phase 1 — Report narrative & information architecture

Target reader journey:

`Project context → stakeholder/background evidence → scoped user needs → measurable design criteria → 3 options → transparent selection → HWW system design → prototype and evaluation → deployment/operational plan → sourced lifecycle costs → community concerns → next steps → references/appendices`.

Implement a simple, consistent navigation matching these sections:

1. Overview / Project details (`index.html`)
2. Background (`pages/background.html`)
3. Problem & criteria (`pages/problem-criteria.html`)
4. Design options & selection (`pages/design-options.html`)
5. Detailed design (`pages/detailed-design.html`)
6. Prototyping (`pages/prototyping.html`)
7. Implementation (`pages/implementation.html`)
8. Cost analysis (`pages/cost-analysis.html`)
9. Other considerations (`pages/considerations.html`)
10. Recommendations (`pages/recommendations.html`)
11. References (`pages/references.html`)
12. Supporting documents (`pages/appendices.html`)

Navigation must develop a coherent argument for HWW, not an arbitrary list of pages. Responsive header/footer, active page, breadcrumbs or prev/next navigation, clear CTA to **Explore Hanoi WaterWatch** (configuration placeholder until actual URL confirmed). The project-report website needs no HWW internal functions or data APIs just to display content.

## Phase 2 — Target directory skeleton

Create **only missing website/report documentation files** according to this layout, adapting extension/framework routing if necessary. Preserve existing files, prevent collisions. If the site is static HTML, use:

```text
Final-Assignment/
├── README.md                          [PRESERVE unless author explicitly approves updates]
├── GITHUB_TEAM_WORKFLOW.md           [PRESERVE]
├── HanoiWaterWatch/                  [PRESERVE ENTIRE DIRECTORY UNCHANGED]
│   └── ...
├── website/
│   ├── README.md                      [PROVIDED; do not overwrite]
│   ├── TEAM_README.md                 [PROVIDED; do not overwrite]
│   ├── index.html
│   ├── pages/
│   │   ├── background.html
│   │   ├── problem-criteria.html
│   │   ├── design-options.html
│   │   ├── detailed-design.html
│   │   ├── prototyping.html
│   │   ├── implementation.html
│   │   ├── cost-analysis.html
│   │   ├── considerations.html
│   │   ├── recommendations.html
│   │   ├── references.html
│   │   └── appendices.html
│   ├── assets/
│   │   ├── css/styles.css
│   │   ├── js/main.js
│   │   ├── images/.gitkeep
│   │   └── icons/.gitkeep
│   ├── content/
│   │   ├── sections/
│   │   │   ├── 01-project-details.md
│   │   │   ├── 02-background.md
│   │   │   ├── 03-problem-criteria.md
│   │   │   ├── 04-design-options.md
│   │   │   ├── 05-detailed-design.md
│   │   │   ├── 06-prototyping.md
│   │   │   ├── 07-implementation.md
│   │   │   ├── 08-cost-analysis.md
│   │   │   ├── 09-considerations.md
│   │   │   └── 10-recommendations.md
│   │   ├── references.md
│   │   ├── figures.csv
│   │   └── evidence-register.csv
│   └── tests/
│       ├── checklist.md
│       └── link-check.md
└── docs/
    └── website/
        ├── architecture.md
        ├── decisions.md
        └── release-checklist.md
```

Use meaningful empty stubs with **clearly labeled `[FILL: ...]` placeholders**; do not fill them with fabricated academic content, invented citations or dummy costs. Populate structural headings, helper instructions and accessible wireframe placeholders only. Keep source drafts and rendered pages synchronized by section ID.

## Phase 3 — Rubric-compliant content scaffolding

Map every rendered page and content stub to:

- **50% Content and stakeholder consideration:** evidence from Hanoi, stakeholder needs and community impact; why criteria exist; option selection reasoning; credible design and prototype evidence; feasible implementation and fully sourced lifecycle costing.
- **30% Website design and audience engagement:** attractive consistent professional layout; accessible responsive navigation; clear headings; diagrams/tables with numbered captions; non-specialist English and coherent reading sequence.
- **20% Referencing, citations and prompts:** APA in-text and reference bibliography; figures/price sources; AI use/non-use declaration, prompts/outputs/screenshots in appendices.

Template maximum: **4,000 website words (excluding permitted ancillary content such as references and appendices)**. Add a simple word-count guidance/checklist; do not falsely count automatically if the site has placeholders or script-generated content. The source template also says to build on **Google Sites**: flag as **submission platform approval required** if using Vercel instead; do not silently claim Vercel meets this platform instruction.

For academic accuracy:
- Present design alternatives HWW / citizen reports / AI-driven digital twin and a placeholder for weighted matrix with weights totaling 100% once confirmed.
- Explicitly separate sensor readings, thresholds, simulated values, actual measured test results, future milestones, and proposed enhancements.
- Any HWW simulator/3D screenshots must be labeled as simulator/prototype, not deployed physical monitoring evidence.
- Cost table should include units, quantities, CAPEX/OPEX, source/date, payer and maintenance/end-of-life; leave empty rather than invent.
- Add simple `figures.csv` and `evidence-register.csv` column headers and one clearly marked example placeholder row if helpful.
- Group declaration must list **actual** contributions only; default to a template, not a completed declaration.

## Phase 4 — Minimum UI/interaction implementation

Implement a **polished but lightweight navigable static scaffold** only, or the nearest equivalent in the existing website framework. Do not build a new backend, CMS, sensor simulator, water-quality API, or 3D model. Build reusable shared CSS and minimal JS, not duplicate styles per page. All pages must have:

- Accessible consistent header, footer, `main`, one `h1`, usable mobile nav, active-page state, working relative links, skip link, focus styles, dark text contrast on readable background, reduced-motion compatibility.
- Content title, one-paragraph `TO BE FILLED` guidance, section placeholder blocks, numbered figure/table slots where appropriate, previous/next navigation.
- Citation-friendly markup and separate link to References/Appendices.
- HWW launch CTA that reads a single configuration value or is clearly marked unconfigured; do not insert invented live URL.
- No broken placeholders disguised as live data. All incomplete academic copy must display obvious `DRAFT — content pending verification` styling in local previews and must not be marked ready for public submission.

## Phase 5 — Verify and deliver

- Run any existing relevant tests/build and a static link check; serve locally if appropriate.
- Verify all 12 pages load, relative paths work from nested `pages/`, navigation and responsive layouts work, HWW CTA is configurable, and no current HWW file has changed.
- Show `git diff --name-status` and `git status --short` and compare before/after HWW tracked state. **No commit and no push unless the user explicitly requested it**.
- Provide a final concise report with:
  1. **Directory tree created**;
  2. **Page flow and why it maps to rubric**;
  3. **Files created vs files intentionally untouched**;
  4. **Exact commands for running the site**;
  5. **Rubric content fields still requiring real author input**;
  6. **Open risks:** platform approval, empty real URL, nested Git/submodule issue, source/cost/test evidence gaps;
  7. Suggested teammate assignment/PR sequence.

## Non-negotiable acceptance criteria

- `HanoiWaterWatch/` unmodified; no attempt to repair Git submodule or change any secret config.
- Only one new **introduction website**, not a copied HWW app.
- Complete route map and well-organised directory skeleton.
- Every required rubric section has a visible draft/home and content instructions.
- Site can eventually be deployed separately from HWW using root `website/`.
- Navigation and external HWW integration defined, with no invented URL.
- All factual claims/measurements/expenses/test results remain empty until verified; APA/prompt log scaffolding present.
- Honest submission caveat about Google Sites vs Vercel.

---

**Now execute safe repository audit, construct only the new introduction website skeleton, verify it, and report exactly what you changed.**
