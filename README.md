# Hanoi WaterWatch

Final assignment of Group One for *Communication for IT Professionals*: real-time detection of untreated wastewater at Hanoi's drain outfalls.

## Repository layout

| Folder | Contents | Start here |
| --- | --- | --- |
| [`website/`](website/) | The report website (React, TypeScript, Vite). Deployed from this folder. | [website/README.md](website/README.md) |
| [`HanoiWaterWatch/`](HanoiWaterWatch/) | The monitoring platform prototype: backend, frontend, firmware, 3D model and the standalone simulator. | [HanoiWaterWatch/README.md](HanoiWaterWatch/README.md) |
| [`docs/website/`](docs/website/) | Website content summary (Vietnamese) and the evidence and figure registers. | [summary.md](docs/website/summary.md) |
| [`docs/team/`](docs/team/) | How the team works with branches and pull requests. | [github-workflow.md](docs/team/github-workflow.md) |
| [`docs/archive/`](docs/archive/) | Older planning notes and drafts, kept for reference. They no longer describe the current code. | |

## Run the website

Node.js 22.12 or later:

```sh
cd website
npm ci
npm run dev
```

## Local settings

`.env` files hold local settings and secrets. Do not commit new ones.
