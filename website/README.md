# Hanoi WaterWatch report website (React + TypeScript + Vite)

Run (Node 22.12+):

    cd website
    npm ci
    npm run dev        # http://localhost:5173
    npm run build      # tsc --noEmit && vite build -> dist/
    npm run preview

Needs internet for fonts and three.js (CDN).

## Layout

    index.html              Vite entry (fonts, meta)
    src/
      main.tsx, App.tsx     mount the page
      content/
        layout/             header (navbar) and footer
        pages/              one HTML file per report page - edit text here
        data.ts             criteria, options, stakeholders, costs, life cycle, team
        index.ts            joins layout and pages in reading order
      scripts/site.ts       routing, menu, reveals, charts, live demo hub
      scripts/ux.ts         skip link, theme switch, section bar, demo status, reference search, figure zoom (styles/ux.css)
      scenes/
        mapScene.ts         home banner: 3D river map
        riverScene.ts       animated headers of the other pages and the closing band
      styles/               index.css imports the sheets in order (hero.css = banner, live-demo.css = hidden demo view)
    public/
      embed/simulator/      ESP32 sensor simulator (source of truth for readings)
      embed/station/        3D station (three.js), opened with ?embed=1 on the Solution page
      img/                  figures

The live demo links simulator -> 3D station -> phone demo -> rule cards.
Files ported from the design prototype start with `// @ts-nocheck`; `App.tsx` and `main.tsx` are strictly typed.

Vercel: Root Directory `website`, Vite preset (see `vercel.json`).
