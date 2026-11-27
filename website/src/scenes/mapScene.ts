// @ts-nocheck  (ported from the design prototype; typed loosely on purpose)
/* Home banner: a 3D map of Hanoi. The Red River, Đuống, Nhuệ, Tô Lịch and Kim Ngưu flow between city
   blocks and ten WaterWatch stations stand on outfalls. In turn one station finds a discharge and the
   scene plays the response: 3 readings over the limit -> alert; a 1 km circle appears and one resident's
   phone turns red; the alert reaches the Department; an inspector drives out for a lab sample; the
   river clears. */
export const MapScene = class {
  constructor(cv) {
    this.cv = cv; this.c = cv.getContext('2d');
    this.on = false; this.raf = 0; this.t = 0; this.evt = null;
    this.A = 3; this.END = 12; this.next = 1; this.ei = 4;
    this.below = document.createElement('canvas'); this.above = document.createElement('canvas');
    this.frame = this.frame.bind(this);
    this.build();
    new ResizeObserver(() => this.resize()).observe(cv); this.resize();
    // labels are cached in a layer, so repaint it once the web fonts have arrived
    document.fonts && document.fonts.ready.then(() => { if (this.W) { this.paintLayers(); if (!this.on) this.draw(this.t, 0); } });
  }
  rnd() { this.s = this.s * 16807 % 2147483647; return (this.s - 1) / 2147483646; }
  build() {
    this.s = 9001;
    const R = (pts, hw, name, lab) => {
      const p = this.spline(pts); let L = 0; p.forEach((q, i) => { if (i) L += Math.hypot(q.x - p[i - 1].x, q.y - p[i - 1].y); q.l = L; });
      p.forEach((q, i) => { const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1; q.nx = -dy / d; q.ny = dx / d; });
      return { p, L, hw, name, lab };
    };
    this.rivers = [
      R([[-.6, -.78], [-.32, -.52], [-.06, -.3], [.1, -.16], [.22, -.06], [.32, .05], [.43, .13], [.53, .19], [.61, .27], [.67, .37], [.70, .49], [.73, .61], [.78, .73], [.85, .85], [.93, 1.06], [1.0, 1.25], [1.04, 1.5]], .024, 'Sông Hồng', [.775, .5]),
      R([[.612, .28], [.72, .245], [.86, .23], [1.02, .2], [1.2, .13], [1.42, .1], [1.7, .02], [2.1, -.04]], .011, 'Sông Đuống', [.98, .265]),
      R([[.2, -.07], [.27, .02], [.23, .12], [.20, .24], [.19, .36], [.21, .48], [.24, .58], [.29, .68], [.35, .78], [.41, .88], [.46, 1.06], [.5, 1.25], [.53, 1.5]], .0065, 'Nhuệ', [.15, .43]),
      R([[.42, .27], [.37, .30], [.33, .35], [.31, .43], [.33, .51], [.37, .59], [.42, .67], [.46, .75], [.47, .83], [.45, .88], [.42, .9]], .005, 'Tô Lịch', [.285, .47]),
      R([[.58, .37], [.585, .46], [.57, .56], [.545, .65], [.505, .74], [.47, .83]], .0045, 'Kim Ngưu', [.61, .6])
    ];
    const blob = (cx, cy, rx, ry, n = 36, j = .14) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, k = 1 + (this.rnd() - .5) * j; return { x: cx + Math.cos(a) * rx * k, y: cy + Math.sin(a) * ry * k }; });
    this.lakes = [{ pts: blob(.455, .235, .052, .038) }, { pts: blob(.60, .405, .007, .012, 16, .08) }, { pts: blob(.53, .33, .012, .008, 16, .1) }, { pts: blob(.5, .79, .016, .011, 20, .12) }, { pts: blob(.27, .2, .014, .01, 20, .12) }, { pts: blob(.9, .52, .02, .014, 20, .2) }, { pts: blob(-.2, .6, .03, .02, 24, .2) }, { pts: blob(.12, .98, .025, .016, 24, .2) }];
    const st = [[2, .197, .275, 'NH-02'], [2, .224, .526, 'NH-04'], [2, .346, .774, 'NH-07'], [3, .333, .346, 'TL-02'], [3, .372, .593, 'TL-06'], [3, .463, .774, 'TL-09'], [4, .577, .513, 'KN-01'], [4, .516, .714, 'KN-03'], [0, .683, .423, 'SH-02'], [2, .424, .932, 'TO-01']];
    this.stations = st.map(([ri, x, y, id]) => {
      const r = this.rivers[ri], sl = this.nearL(r, x, y), q = this.at(r, sl);
      return { id, ri, sl, river: r.name, x: q.x + q.nx * (r.hw + .006), y: q.y + q.ny * (r.hw + .006), ind: id === 'TO-01', ph: this.rnd() };
    });
    this.hq = { x: .585, y: .355 };
    this.water = (x, y, m) => this.rivers.some(r => r.p.some((q, i) => i && this.segD(x, y, r.p[i - 1], q) < r.hw + m)) || this.lakes.some(l => this.inPoly(x, y, l.pts, m));
    const dcF = (x, y) => Math.hypot(x - .52, (y - .48) * 1.15);
    this.fields = [];
    for (let k = 0; k < 600 && this.fields.length < 170; k++) {
      const x = -1.4 + this.rnd() * 3.5, y = -.8 + this.rnd() * 2.3, dc = dcF(x, y);
      if (dc < .62 + this.rnd() * .2) continue;
      const w = .05 + this.rnd() * .09, d = .035 + this.rnd() * .06, a = (this.rnd() - .5) * .5;
      if (this.water(x, y, Math.max(w, d) * .6)) continue;
      this.fields.push({ x, y, w, d, a, g: this.rnd() });
    }
    this.blds = [];
    for (let k = 0; k < 4000 && this.blds.length < 1150; k++) {
      const x = -1.35 + this.rnd() * 3.35, y = -.75 + this.rnd() * 2.1, dc = dcF(x, y);
      if (this.rnd() > Math.max(.07, 1.15 - dc * 1.25)) continue;
      const w = .007 + this.rnd() * .012, d = .007 + this.rnd() * .012;
      if (this.water(x, y, .014 + Math.max(w, d))) continue;
      if (Math.hypot(x - this.hq.x, y - this.hq.y) < .022) continue;
      if (this.stations.some(s => Math.hypot(x - s.x, y - s.y) < .016)) continue;
      if (this.fields.some(f => Math.abs(x - f.x) < f.w * .55 && Math.abs(y - f.y) < f.d * .55)) continue;
      this.blds.push({ x, y, w, d, h: (.1 + this.rnd() ** 2 * .85) * Math.max(.22, 1.3 - dc * 1.05), lit: this.rnd() < .2 });
    }
    this.flow = [];
    this.rivers.forEach((r, ri) => {
      const wide = ri < 2, lanes = wide ? [-.72, -.36, 0, .36, .72] : [-.5, 0, .5];
      lanes.forEach((o, li) => {
        const gap = wide ? .085 : .075, n = Math.max(2, Math.round(r.L / gap)), step = r.L / n, shift = this.rnd() * step;
        // one speed per lane (fastest mid-stream), so streaks never bunch up or overtake each other
        const v = (wide ? .045 : .034) * (1 - .35 * o * o);
        for (let i = 0; i < n; i++) this.flow.push({ ri, s: (shift + i * step + (this.rnd() - .5) * step * .45 + r.L) % r.L, o, v, len: .03 + this.rnd() * .018, ph: li * 2.1 + ri });
      });
    });
    this.RZ = .1;
  }
  spline(pts, step = .012) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
      for (let j = 0; j < n; j++) {
        const t = j / n, t2 = t * t, t3 = t2 * t;
        const f = k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3);
        out.push({ x: f(0), y: f(1) });
      }
    }
    const last = pts[pts.length - 1]; out.push({ x: last[0], y: last[1] });
    return out;
  }
  nearL(r, x, y) { let best = 1e9, bl = 0; r.p.forEach((b, i) => { if (!i) return; const a = r.p[i - 1], dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / L2)), d = Math.hypot(x - a.x - t * dx, y - a.y - t * dy); if (d < best) { best = d; bl = a.l + t * (b.l - a.l); } }); return bl; }
  segD(x, y, a, b) { const dx = b.x - a.x, dy = b.y - a.y, t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - a.x - t * dx, y - a.y - t * dy); }
  inPoly(x, y, pts, m) { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], b = pts[j]; if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) c = !c; } if (c) return true; return pts.some((p, i) => this.segD(x, y, p, pts[(i + 1) % pts.length]) < m); }
  at(r, l) { const p = r.p; let i = 1, hi = p.length - 1; while (i < hi) { const m = (i + hi) >> 1; if (p[m].l < l) i = m + 1; else hi = m; } const a = p[i - 1], b = p[i], k = Math.max(0, Math.min(1, (l - a.l) / ((b.l - a.l) || 1))); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, nx: a.nx + (b.nx - a.nx) * k, ny: a.ny + (b.ny - a.ny) * k }; }
  resize() {
    const r = this.cv.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    if (r.width === this.W && r.height === this.H && dpr === this.dpr) return;
    this.W = r.width; this.H = r.height; this.dpr = dpr;
    // up to 860px wide the map has its own box under the headline, so it is centred (matches hero.css)
    this.compact = matchMedia('(max-width: 860px)').matches;
    this.cx = this.W * (this.compact ? .5 : .64);
    this.cy = this.H * (this.compact ? .43 : .55);
    this.F = this.compact ? Math.min(this.W * 1.2, this.H * 1.56) : Math.min(this.W * .84, this.H * 1.55);
    this.u = this.F / 1100;
    for (const cv of [this.cv, this.below, this.above]) { cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); }
    this.paintLayers();
    if (!this.on) { if (matchMedia('(prefers-reduced-motion: reduce)').matches) this.still(); else this.draw(this.t, 0); }
  }
  P(x, y, h = 0) {
    const S = 10, X = (x - .5) * S, Z = (.5 - y) * S * 1.05;
    const D = 13, sp = .79560162, cp = .60582016; // sine and cosine of the camera pitch (.92 rad)
    const yc = h * cp + Z * sp, zc = Math.max(.5, D - h * sp + Z * cp);
    return [this.cx + this.F * X / zc, this.cy - this.F * yc / zc, this.F / zc];
  }
  still() { this.t = 20; this.evt = { s: this.stations[4], t0: 20 - 6.2 }; this.draw(20, 0); }
  start() { if (this.on) return; if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.still(); return; } this.on = true; this.last = performance.now(); this.raf = requestAnimationFrame(this.frame); }
  stop() { this.on = false; cancelAnimationFrame(this.raf); }
  frame(now) { if (!this.on) return; const dt = Math.max(0, Math.min(.05, (now - this.last) / 1000)); this.last = now; this.t += dt; this.draw(this.t, dt); this.raf = requestAnimationFrame(this.frame); }
  path(c, pts) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); }
  pill(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
  /* Everything that never moves is painted once per size: ground and water below the current,
     buildings, haze and place names above it. Each frame then only draws what is actually moving. */
  paintLayers() {
    const W = this.W, H = this.H, u = this.u;
    const vis = (x, y) => x > -80 && x < W + 80 && y > -60 && y < H + 140;
    let c = this.below.getContext('2d'), g;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); c.clearRect(0, 0, W, H);
    // ground fills the frame
    g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#050f1b'); g.addColorStop(.5, '#0a1d31'); g.addColorStop(1, '#0d2640'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(124,192,232,.075)'; c.lineWidth = 1;
    for (let v = -1.5; v <= 2.2; v += .1) { this.path(c, [this.P(v, -.9), this.P(v, 1.6)]); c.stroke(); }
    for (let v = -.9; v <= 1.6; v += .1) { this.path(c, [this.P(-1.5, v), this.P(2.2, v)]); c.stroke(); }
    // fields on the outskirts
    for (const f of this.fields) {
      const ca = Math.cos(f.a), sa = Math.sin(f.a), hw = f.w / 2, hd = f.d / 2;
      const pts = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([a, b]) => this.P(f.x + a * ca - b * sa, f.y + a * sa + b * ca));
      if (!pts.some(([x, y]) => vis(x, y))) continue;
      c.fillStyle = `rgba(${90 + f.g * 40},${150 + f.g * 30},${80 + f.g * 20},${.07 + f.g * .06})`; this.path(c, pts); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(140,193,82,.12)'; c.lineWidth = 1; c.stroke();
    }
    // lakes
    for (const l of this.lakes) { const pts = l.pts.map(q => this.P(q.x, q.y)); c.fillStyle = 'rgba(40,110,170,.55)'; this.path(c, pts); c.closePath(); c.fill(); c.strokeStyle = 'rgba(124,192,232,.45)'; c.lineWidth = 1.2; c.stroke(); }
    // rivers: all banks first, then all water, so confluences join without seams
    const banks = this.rivers.map(r => ({ r, left: r.p.map(q => this.P(q.x + q.nx * r.hw, q.y + q.ny * r.hw)), right: r.p.map(q => this.P(q.x - q.nx * r.hw, q.y - q.ny * r.hw)) }));
    c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = 'rgba(124,192,232,.55)'; c.lineWidth = 2.2;
    for (const k of banks) { this.path(c, k.left); c.stroke(); this.path(c, k.right); c.stroke(); }
    for (const k of banks) { c.fillStyle = k.r.hw > .01 ? '#1d5283' : '#245f93'; this.path(c, k.left.concat(k.right.slice().reverse())); c.closePath(); c.fill(); }

    c = this.above.getContext('2d');
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); c.clearRect(0, 0, W, H);
    // buildings, far to near, culled to the frame
    const items = [];
    for (const b of this.blds) { const p = this.P(b.x, b.y); if (!vis(p[0], p[1])) continue; items.push({ b, k: p[2] }); }
    items.sort((p, q) => p.k - q.k);
    const kMin = this.F / 21, kMax = this.F / 9;
    for (const { b, k } of items) this.box(c, b, Math.max(0, Math.min(1, (k - kMin) / (kMax - kMin))));
    // distance fog toward the top of the frame
    g = c.createLinearGradient(0, 0, 0, H * .55); g.addColorStop(0, 'rgba(5,15,27,.92)'); g.addColorStop(.45, 'rgba(5,15,27,.45)'); g.addColorStop(1, 'rgba(5,15,27,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H * .55);
    g = c.createLinearGradient(0, 0, 0, H * .3); g.addColorStop(0, 'rgba(74,159,216,.12)'); g.addColorStop(1, 'rgba(74,159,216,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H * .3);
    // labels
    c.font = `italic 600 ${Math.round(12 + 2 * u)}px "Source Serif 4", Georgia, serif`; c.fillStyle = 'rgba(170,215,240,.8)'; c.textAlign = 'center';
    for (const r of this.rivers) { const [x, y] = this.P(r.lab[0], r.lab[1]); if (x > 40 && x < W - 40 && y > 30 && y < H - 10) c.fillText(r.name, x, y); }
    { const [x, y] = this.P(.455, .235); c.fillText('Hồ Tây', x, y + 4); }
    // edge vignette
    g = c.createRadialGradient(W * .6, H * .55, Math.min(W, H) * .35, W * .6, H * .55, Math.max(W, H) * .85);
    g.addColorStop(0, 'rgba(4,13,24,0)'); g.addColorStop(1, 'rgba(4,13,24,.6)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  /* The moving current: tapered streaks that follow the curve of each river, fading in at the source and
     out at the mouth. Water downstream of an alerting station blends smoothly to red. */
  current(c, dt, E, reach, fade) {
    const W = this.W, H = this.H, groups = new Map(), N = 6;
    const add = (style, width, pts) => { const key = style + '|' + width; let g = groups.get(key); if (!g) groups.set(key, g = { style, width, lines: [] }); g.lines.push(pts); };
    for (const f of this.flow) {
      const r = this.rivers[f.ri]; f.s = (f.s + f.v * dt) % r.L;
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const l = Math.max(0, f.s - f.len * (1 - i / N)), q = this.at(r, l);
        const off = (f.o + .09 * Math.sin(l * 26 + f.ph)) * r.hw * .85;
        pts.push(this.P(q.x + q.nx * off, q.y + q.ny * off));
      }
      const [hx, hy, k] = pts[N]; if (hx < -80 || hx > W + 80 || hy < -60 || hy > H + 140) continue;
      const edge = Math.max(0, Math.min(1, f.s / .09, (r.L - f.s) / .09));
      let red = 0;
      if (reach > 0 && f.ri === E.s.ri) red = Math.max(0, Math.min(1, (f.s - E.s.sl) / .02, (E.s.sl + reach - f.s) / .04)) * fade;
      // quantised so that streaks sharing a look are stroked in one call
      const quant = v => Math.round(v * 12) / 12, e = quant(edge), m = quant(red); if (!e) continue;
      const rgb = `${Math.round(160 + 95 * m)},${Math.round(215 - 95 * m)},${Math.round(245 - 150 * m)}`, al = (.4 + .5 * m) * e;
      const w = Math.max(.8, Math.round(k * .018 * 4) / 4);
      add(`rgba(${rgb},${(al * .45).toFixed(3)})`, w * .75, pts);
      add(`rgba(${rgb},${al.toFixed(3)})`, w, pts.slice(N - 3));
    }
    c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.lineJoin = 'round';
    for (const g of groups.values()) {
      c.strokeStyle = g.style; c.lineWidth = g.width; c.beginPath();
      for (const line of g.lines) line.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
      c.stroke();
    }
    c.globalCompositeOperation = 'source-over';
  }
  draw(t, dt) {
    const c = this.c, W = this.W, H = this.H, A = this.A, END = this.END;
    if (!W) return;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    // event timeline
    if (!this.evt && t > this.next) { const s = this.stations[this.ei % this.stations.length]; this.ei += 3; this.evt = { s, t0: t }; }
    if (this.evt && t - this.evt.t0 > END) { this.evt = null; this.next = t + 1.4; }
    const E = this.evt, ek = E ? t - E.t0 : -1;
    const aK = E && ek > A ? ek - A : -1, fade = E ? Math.max(0, Math.min(1, (END - ek) / 1.2)) : 0;
    c.drawImage(this.below, 0, 0, W, H);
    const reach = aK >= 0 ? Math.min(.3, aK * .07) : 0;
    if (reach > .004) {
      const r = this.rivers[E.s.ri], pts = [];
      for (let l = E.s.sl; l <= Math.min(r.L, E.s.sl + reach); l += .004) { const q = this.at(r, l); pts.push(this.P(q.x, q.y)); }
      if (pts.length > 1) { c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = `rgba(255,107,87,${.38 * fade})`; c.lineWidth = Math.max(3, pts[0][2] * r.hw * 14); this.path(c, pts); c.stroke(); c.globalCompositeOperation = 'source-over'; }
    }
    this.current(c, dt, E, reach, fade);
    // alert zone on the ground: fill + travelling signal waves
    const RR = aK >= 0 ? Math.min(this.RZ, aK * .045) : 0;
    const circ = (r, n = 64) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return this.P(E.s.x + Math.cos(a) * r, E.s.y + Math.sin(a) * r); });
    if (aK >= 0) {
      c.fillStyle = `rgba(255,107,87,${.1 * fade})`; this.path(c, circ(RR)); c.closePath(); c.fill();
      if (aK < 3) for (let i = 0; i < 2; i++) { const ph = (aK * .8 + i / 2) % 1, rr = ph * this.RZ; c.strokeStyle = `rgba(255,140,110,${(1 - ph) * .55 * (1 - aK / 3)})`; c.lineWidth = 1.5; this.path(c, circ(rr, 48)); c.closePath(); c.stroke(); }
    }
    c.drawImage(this.above, 0, 0, W, H);
    // dashed zone edge
    if (aK >= 0) {
      c.strokeStyle = `rgba(255,107,87,${.6 * fade})`; c.setLineDash([6, 6]); c.lineWidth = 1.2; this.path(c, circ(RR)); c.closePath(); c.stroke(); c.setLineDash([]);
    }
    // Department dashboard
    this.hqDraw(c, aK);
    // stations
    const sts = this.stations.map(s => ({ s, k: this.P(s.x, s.y)[2] })).sort((p, q) => p.k - q.k);
    for (const { s } of sts) this.pin(c, s, t, E && E.s === s ? (aK >= 0 ? 'alert' : 'check') : 'ok', aK, fade);
    // one resident's phone turns red: a home inside the 1 km circle, just beside the station
    if (aK >= 0 && aK < END - A) {
      if (!E.home) {
        const tx = E.s.x + this.RZ * (this.compact ? .78 : .62), ty = E.s.y + this.RZ * (this.compact ? .5 : .3), d = b => Math.hypot(b.x - tx, b.y - ty);
        E.home = this.blds.reduce((best, b) => d(b) < d(best) ? b : best);
      }
      const b = E.home, act = aK - .9;
      if (act >= 0) {
        const [hx, hy, k] = this.P(b.x, b.y, b.h + .1), s = Math.max(this.compact ? 1.05 : 1.35, k / 55), pop = Math.min(1, act / .45), ease = 1 + Math.sin(pop * Math.PI) * .25;
        if (act < 1) { c.strokeStyle = `rgba(255,107,87,${(1 - act) * .6})`; c.lineWidth = 1.5; c.beginPath(); c.arc(hx, hy - 12 * s, 8 + act * 18 * s, 0, 7); c.stroke(); }
        this.phone(c, hx, hy, s * pop * ease, fade);
      }
    }
    // signal to the Department
    if (aK > .2 && aK < 3.4) {
      const k = Math.min(1, (aK - .2) / 2.2), pts = [];
      for (let i = 0; i <= 40; i++) { const v = i / 40, x = E.s.x + (this.hq.x - E.s.x) * v, y = E.s.y + (this.hq.y - E.s.y) * v, h = .75 + v * .4 + Math.sin(v * Math.PI) * 1.4; pts.push(this.P(x, y, h)); }
      c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(255,150,130,.4)'; c.setLineDash([5, 7]); c.lineWidth = 1.4; this.path(c, pts); c.stroke(); c.setLineDash([]);
      const [dx, dy] = pts[Math.round(k * 40)], gr = c.createRadialGradient(dx, dy, 0, dx, dy, 18); gr.addColorStop(0, 'rgba(255,210,195,1)'); gr.addColorStop(1, 'rgba(255,107,87,0)'); c.fillStyle = gr; c.fillRect(dx - 18, dy - 18, 36, 36);
      c.globalCompositeOperation = 'source-over';
    }
    // inspector drives out for a lab sample
    if (aK > 3.4 && aK < END - A) {
      const v = Math.min(1, (aK - 3.4) / 3), e = v * v * (3 - 2 * v), x = this.hq.x + (E.s.x - this.hq.x) * e, y = this.hq.y + (E.s.y - this.hq.y) * e;
      const [ax, ay] = this.P(this.hq.x, this.hq.y), [bx, by] = this.P(E.s.x, E.s.y), [ix, iy, k] = this.P(x, y, .02);
      c.strokeStyle = `rgba(242,165,65,${.3 * fade})`; c.setLineDash([3, 6]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); c.setLineDash([]);
      const gr = c.createRadialGradient(ix, iy, 0, ix, iy, 16); gr.addColorStop(0, `rgba(255,200,120,${fade})`); gr.addColorStop(1, 'rgba(242,165,65,0)'); c.fillStyle = gr; c.fillRect(ix - 16, iy - 16, 32, 32);
      c.fillStyle = '#f2a541'; c.beginPath(); c.arc(ix, iy, Math.max(3, k * .045), 0, 7); c.fill();
    }
  }
  box(c, b, near) {
    const x0 = b.x - b.w / 2, x1 = b.x + b.w / 2, y0 = b.y - b.d / 2, y1 = b.y + b.d / 2;
    const top = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => this.P(x, y, b.h)), bot = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => this.P(x, y, 0));
    const f = .45 + .55 * near;
    const side = (i, j, r, g, bl) => { c.fillStyle = `rgb(${Math.round(r * f + 6 * (1 - f))},${Math.round(g * f + 16 * (1 - f))},${Math.round(bl * f + 28 * (1 - f))})`; c.beginPath(); c.moveTo(bot[i][0], bot[i][1]); c.lineTo(bot[j][0], bot[j][1]); c.lineTo(top[j][0], top[j][1]); c.lineTo(top[i][0], top[i][1]); c.closePath(); c.fill(); };
    side(3, 2, 26, 54, 82);
    side(0, 3, 18, 40, 66);
    const tr = b.lit ? 88 : 44, tg = b.lit ? 150 : 88, tb = b.lit ? 205 : 128;
    c.fillStyle = `rgb(${Math.round(tr * f + 6 * (1 - f))},${Math.round(tg * f + 16 * (1 - f))},${Math.round(tb * f + 28 * (1 - f))})`;
    c.beginPath(); top.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill();
    if (near > .35) { c.strokeStyle = `rgba(124,192,232,${.16 * near})`; c.lineWidth = .7; c.stroke(); }
  }
  chip(c, x, y, txt, col, a) {
    const u = Math.max(.85, Math.min(1.15, this.u));
    c.save(); c.globalAlpha = a; c.font = `700 ${Math.round(11.5 * u)}px "Public Sans", Arial, sans-serif`; c.textAlign = 'left';
    const w = c.measureText(txt).width + 22 * u, h = 22 * u; let px = x - w / 2, py = y - h;
    px = Math.max(8, Math.min(this.W - w - 8, px)); py = Math.max(8, py);
    c.fillStyle = 'rgba(4,13,24,.88)'; c.strokeStyle = col; c.lineWidth = 1.2; this.pill(c, px, py, w, h, h / 2); c.fill(); c.stroke();
    c.fillStyle = col; c.beginPath(); c.arc(px + 10 * u, py + h / 2, 3.2 * u, 0, 7); c.fill();
    c.fillStyle = '#f4f8fb'; c.fillText(txt, px + 17 * u, py + h / 2 + 4 * u); c.restore();
  }
  phone(c, x, y, s, a) {
    if (s <= .02) return;
    c.save(); c.globalAlpha = a; c.translate(x, y - 12 * s); c.scale(s, s);
    c.fillStyle = 'rgba(4,13,24,.92)'; c.strokeStyle = '#ff6b57'; c.lineWidth = 1.6; this.pill(c, -7, -12, 14, 22, 3.5); c.fill(); c.stroke();
    c.fillStyle = '#ff6b57'; this.pill(c, -4.5, -9, 9, 14, 1.5); c.fill();
    c.fillStyle = '#fff'; c.font = '800 11px "Public Sans", Arial, sans-serif'; c.textAlign = 'center'; c.fillText('!', 0, 2.5);
    c.beginPath(); c.moveTo(-3, 10); c.lineTo(0, 15); c.lineTo(3, 10); c.fillStyle = '#ff6b57'; c.fill();
    c.restore();
  }
  hqDraw(c, aK) {
    const b = { x: this.hq.x, y: this.hq.y, w: .024, d: .02, h: 1.05, lit: false };
    const hit = aK > 2.4 && aK < 6.2;
    this.box(c, b, 1);
    const [x, y] = this.P(b.x, b.y, b.h + .02);
    c.globalCompositeOperation = 'lighter';
    const gr = c.createRadialGradient(x, y, 0, x, y, 30); gr.addColorStop(0, hit ? 'rgba(255,150,120,.85)' : 'rgba(124,192,232,.9)'); gr.addColorStop(1, 'rgba(74,159,216,0)');
    c.fillStyle = gr; c.fillRect(x - 30, y - 30, 60, 60);
    c.globalCompositeOperation = 'source-over';
    this.chip(c, x, y - 10, 'Department', hit ? '#ff6b57' : '#7cc0e8', 1);
  }
  pin(c, s, t, state, aK, fade) {
    const col = state === 'alert' ? '255,107,87' : state === 'check' ? '242,165,65' : '140,193,82', hex = state === 'alert' ? '#ff6b57' : state === 'check' ? '#f2a541' : '#8cc152';
    const H0 = .78, [bx, by, k] = this.P(s.x, s.y, 0), [tx, ty] = this.P(s.x, s.y, H0), sz = Math.max(.75, k / 85);
    c.globalCompositeOperation = 'lighter';
    const act = state !== 'ok';
    let gr = c.createRadialGradient(bx, by, 0, bx, by, (act ? 26 : 15) * sz); gr.addColorStop(0, `rgba(${col},${act ? .55 : .35})`); gr.addColorStop(1, `rgba(${col},0)`); c.fillStyle = gr; c.fillRect(bx - 26 * sz, by - 26 * sz, 52 * sz, 52 * sz);
    if (act)
    for (let i = 0; i < 2; i++) { const ph = (t * .9 + i / 2) % 1, rr = .006 + ph * .03; const ring = Array.from({ length: 32 }, (_, j) => { const a = j / 32 * Math.PI * 2; return this.P(s.x + Math.cos(a) * rr, s.y + Math.sin(a) * rr); }); c.strokeStyle = `rgba(${col},${(1 - ph) * .75})`; c.lineWidth = 1.5; this.path(c, ring); c.closePath(); c.stroke(); }
    // mast
    c.strokeStyle = `rgba(${col},${act ? .95 : .7})`; c.lineWidth = Math.max(1.4, (act ? 2.4 : 1.8) * sz); c.beginPath(); c.moveTo(bx, by); c.lineTo(tx, ty); c.stroke();
    if (state === 'alert') {
      const bh = Math.min(1.3, aK * 3), [hx, hy] = this.P(s.x, s.y, H0 + bh);
      gr = c.createLinearGradient(tx, ty, hx, hy); gr.addColorStop(0, `rgba(255,120,95,${.95 * fade})`); gr.addColorStop(1, 'rgba(255,120,95,0)');
      c.strokeStyle = gr; c.lineWidth = Math.max(2.5, 4 * sz); c.beginPath(); c.moveTo(tx, ty); c.lineTo(hx, hy); c.stroke();
    }
    c.globalCompositeOperation = 'source-over';
    // solar panel on the mast
    const pw = .011, pd = .008, ph0 = H0 - .05, pts = [[-pw, -pd, ph0 + .09], [pw, -pd, ph0 + .09], [pw, pd, ph0], [-pw, pd, ph0]].map(([dx, dy, h]) => this.P(s.x + dx, s.y + dy, h));
    c.fillStyle = '#16365a'; this.path(c, pts); c.closePath(); c.fill(); c.strokeStyle = hex; c.lineWidth = 1.2; c.stroke();
    c.strokeStyle = 'rgba(124,192,232,.5)'; c.lineWidth = .8; c.beginPath(); c.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2); c.lineTo((pts[2][0] + pts[3][0]) / 2, (pts[2][1] + pts[3][1]) / 2); c.stroke();
    // status light
    const blink = state === 'ok' ? .85 + .15 * Math.sin(t * 3 + s.ph * 6) : .8 + .2 * Math.sin(t * 3);
    const [lx, ly] = this.P(s.x, s.y, H0 + .1);
    c.globalCompositeOperation = 'lighter'; gr = c.createRadialGradient(lx, ly, 0, lx, ly, (act ? 20 : 12) * sz); gr.addColorStop(0, `rgba(${col},${act ? blink : .8})`); gr.addColorStop(1, `rgba(${col},0)`); c.fillStyle = gr; c.fillRect(lx - 20 * sz, ly - 20 * sz, 40 * sz, 40 * sz); c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#fff'; c.beginPath(); c.arc(lx, ly, Math.max(2, 2.8 * sz), 0, 7); c.fill();
    // name tag
    if (!act) return;
    const u = Math.max(.8, Math.min(1.1, sz)), txt = state === 'alert' ? `${s.id}  ALERT` : s.id;
    c.font = `700 ${Math.round(11 * u)}px "IBM Plex Mono", Menlo, monospace`; c.textAlign = 'left';
    const w = c.measureText(txt).width + 22 * u, h = 20 * u, px = lx - w / 2, py = ly - h - 12 * u;
    c.fillStyle = state === 'alert' ? '#ff6b57' : 'rgba(4,13,24,.9)'; c.strokeStyle = hex; c.lineWidth = 1.3; this.pill(c, px, py, w, h, 5 * u); c.fill(); c.stroke();
    c.fillStyle = state === 'alert' ? '#fff' : hex; c.beginPath(); c.arc(px + 9 * u, py + h / 2, 3 * u, 0, 7); c.fill();
    c.fillStyle = state === 'alert' ? '#fff' : '#eef5f9'; c.fillText(txt, px + 16 * u, py + h / 2 + 4 * u);
    if (s.ind) { c.strokeStyle = hex; c.lineWidth = 1.2; c.strokeRect(bx - 5, by - 5, 10, 10); }
  }
};
