# Hanoi WaterWatch report website (React + TypeScript + Vite)

Run (Node 22.12+):

    cd website
    npm ci
    npm run dev        # http://localhost:5173
    npm run build      # tsc --noEmit && vite build -> dist/
    npm run preview

Needs internet for fonts and three.js (CDN).

## Layout
- `index.html` – Vite entry (fonts, meta).
- `src/page.html` – the report markup (hash-routed pages: Home, Design, Solution, ...). Edit text here.
- `src/site.ts` – behaviour: menu, reveals, charts, and the LIVE DEMO hub linking simulator -> 3D station -> phone demo -> rule cards.
- `src/scene.ts` – animated river canvas. `src/site.css` – all styling (light/dark).
- `public/embed/simulator/` – ESP32 sensor simulator (source of truth for readings).
- `public/embed/station/` – 3D station (three.js), opened with `?embed=1` inside the Solution page.
- `public/app/` – resident app prototype. `content/` – evidence and figure registers (unchanged).

`site.ts` and `scene.ts` start with `// @ts-nocheck` because they are ported from the design prototype; `App.tsx` and `main.tsx` are strictly typed.
Vercel: Root Directory `website`, Vite preset (see `vercel.json`).
