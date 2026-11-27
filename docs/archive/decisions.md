# Implementation decisions

- The report is a self-contained React and TypeScript application under `website/`. It uses the requested Vercel SPA rewrite. The repository’s root simulator and app-related files belong to the existing project.
- Section files are typed TypeScript data, with one file per report section. The same data renders the report, so teammates have one version of each section to edit.
- The layout uses typography, whitespace, underlines and grayscale rules. The launch control uses a conventional outline so readers can find it on every page.
- The public app URL is the only deployment-time integration. A pending label is displayed while the team verifies the independent app domain.
- Draft copy uses visible `[FILL: …]` prompts. The report HTML includes `noindex` while evidence and submission approval are pending.
- The initial audit on `main` found `HanoiWaterWatch/` tracked as a regular directory and no submodule mapping issue in this checkout. Root-level `.env` and `.env.local` are tracked filenames that need maintainer review. Their contents were outside the audit.
