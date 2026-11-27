// @ts-nocheck  (ported from the design prototype; typed loosely on purpose)
/* Hanoi WaterWatch – animated river scene.
   mode 'hero': dusk river, Hanoi skyline and a truss bridge; an embankment wall with a drain outfall;
                a WaterWatch station whose probe sits in the outflow. Every 18 s a discharge darkens the
                outflow, a plume spreads downstream, the station counts three bad readings, turns red and
                sends signals to the city, whose windows flash. Then the water clears.
   mode 'band': the same river, skyline and bridge, calm, for page headers and the closing band. */
export const RiverScene = class {
  constructor(cv, o = {}) {
    this.cv = cv; this.c = cv.getContext('2d'); this.o = Object.assign({ mode: 'band', seed: 7 }, o);
    this.on = false; this.ps = []; this.sig = []; this.flash = []; this.t = 0;
    this.st = { n: 0, alert: false, alertAt: -99, lastS: -1, clean: 0, I: 0, v: { ph: 7.2, do: 5.2, ntu: 38 } };
    this.frame = this.frame.bind(this);
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(cv); this.resize();
  }
  rnd() { this.s = this.s * 16807 % 2147483647; return (this.s - 1) / 2147483646; }
  resize() {
    const r = this.cv.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const dpr = Math.min(devicePixelRatio || 1, this.o.mode === 'hero' ? 1.75 : 1.5);
    this.W = r.width; this.H = r.height; this.dpr = dpr;
    this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round(r.height * dpr);
    this.layout(); this.prerender();
    if (!this.on) this.draw(this.t || 2);
  }
  layout() {
    const W = this.W, H = this.H, hero = this.o.mode === 'hero';
    const portrait = hero && W / H < 0.9;
    const top = portrait ? H * 0.43 : 0, sh = H - top;
    const L = this.L = { W, H, top, sh, portrait, hero };
    L.k = Math.max(.55, Math.min(1.25, sh / 820));
    L.hz = top + sh * (hero ? (portrait ? .27 : .57) : .64);
    if (hero) {
      L.x0 = W * (portrait ? .40 : .64);
      L.wt = top + sh * (portrait ? .30 : .45);
      L.wy = top + sh * (portrait ? .76 : .77);
      L.r = Math.max(15, Math.min(44, sh * .052));
      L.ox = L.x0 + (W - L.x0) * (portrait ? .30 : .28);
      L.oy = top + sh * (portrait ? .52 : .61);
      L.px = L.x0 + (W - L.x0) * (portrait ? .70 : .62);
      L.pt = top + sh * (portrait ? .04 : .24);
      L.bh = 46 * L.k; L.bw = 34 * L.k; L.by = L.wt - L.bh - 22 * L.k;
      L.probe = { x: L.ox + L.r * .2, y: L.oy + L.r * 1.75 };
      L.imp = { x: L.ox - L.r * .28, y: L.wy };
      L.bridgeEnd = L.x0 + 40;
    } else {
      L.bridgeEnd = W * .62;
    }
    // skyline
    this.s = this.o.seed * 1000 + 17;
    const bld = (n0, hMin, hMax, wMin, wMax, col, lit) => {
      const out = []; let x = -20;
      while (x < W + 20) {
        const w = wMin + this.rnd() * (wMax - wMin), h = sh * (hMin + this.rnd() * (hMax - hMin));
        const b = { x, w, h, col, win: [] };
        const cw = 7 * L.k + 2, ch = 9 * L.k + 2;
        for (let wy = L.hz - h + 8; wy < L.hz - 8; wy += ch) for (let wx = x + 5; wx < x + w - 6; wx += cw) {
          if (this.rnd() < lit) b.win.push({ x: wx, y: wy, w: Math.max(2, cw - 4), h: Math.max(2, ch - 5), ph: this.rnd() * 6.28, f: .3 + this.rnd() * 1.2, warm: this.rnd() < .78, a: .35 + this.rnd() * .55 });
        }
        out.push(b); x += w + (this.rnd() < .25 ? 6 + this.rnd() * 20 : 0);
      }
      return out;
    };
    this.far = bld(0, .05, .17, 16, 44, '#163a59', .10);
    this.near = bld(1, .07, hero ? .22 : .26, 22, 62, '#0d2a44', .17);
    this.tower = { x: W * (hero && !portrait ? .30 : .22), w: 30 * L.k + 10, h: sh * (hero ? .36 : .44) };
    this.wins = [];
    [...this.far, ...this.near].forEach(b => b.win.forEach(w => this.wins.push(w)));
    // tower windows
    const T = this.tower; T.win = [];
    for (let y = L.hz - T.h + 30; y < L.hz - 6; y += 8 * L.k + 3) for (let x = T.x + 4; x < T.x + T.w - 5; x += 6 * L.k + 2) if (this.rnd() < .35) T.win.push({ x, y, w: 3, h: 4, ph: this.rnd() * 6, f: .5 + this.rnd(), warm: true, a: .6 });
    this.wins.push(...T.win);
    this.refl = this.wins.filter(w => this.rnd() < .25).slice(0, 70);
    this.stars = Array.from({ length: 60 }, () => ({ x: this.rnd() * W, y: this.rnd() * (L.hz - (hero ? sh * .3 : sh * .3)), r: .4 + this.rnd() * 1.1, ph: this.rnd() * 6 }));
    // wave rows (perspective: closer rows further apart)
    this.rows = [];
    for (let i = 0, y = L.hz + 3; y < H + 10; i++) {
      const d = (y - L.hz) / (H - L.hz + 1);
      this.rows.push({ y, d, sp: 14 + d * 46, len: 6 + d * 36, a: .05 + d * .14, off: this.rnd() * 200, v: 6 + d * 34 });
      y += 3 + d * 16;
    }
    this.sprites();
  }
  sprites() {
    const mk = (col) => { const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return s; };
    this.spBrown = mk('rgba(128,84,48,.95)'); this.spCoral = mk('rgba(255,107,87,.85)'); this.spFoam = mk('rgba(235,240,230,.9)'); this.spGlow = mk('rgba(255,107,87,1)'); this.spLime = mk('rgba(200,241,105,1)'); this.spWarm = mk('rgba(255,214,140,1)');
  }
  prerender() {
    const L = this.L, W = this.W, H = this.H;
    const mk = () => { const cv = document.createElement('canvas'); cv.width = this.cv.width; cv.height = this.cv.height; const g = cv.getContext('2d'); g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); return [cv, g]; };
    // background: sky, glow, stars, far city, tower, near city, bridge, water
    const [bg, g] = mk(); this.bg = bg;
    let gr = g.createLinearGradient(0, 0, 0, L.hz);
    gr.addColorStop(0, '#04121f'); gr.addColorStop(.55, '#0b2740'); gr.addColorStop(1, '#2b5470');
    g.fillStyle = gr; g.fillRect(0, 0, W, L.hz + 1);
    gr = g.createRadialGradient(W * .32, L.hz, 0, W * .32, L.hz, Math.max(W, H) * .55);
    gr.addColorStop(0, 'rgba(242,190,110,.30)'); gr.addColorStop(.45, 'rgba(242,190,110,.08)'); gr.addColorStop(1, 'rgba(242,190,110,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, L.hz);
    const drawB = (arr) => arr.forEach(b => { g.fillStyle = b.col; g.fillRect(b.x, L.hz - b.h, b.w, b.h); g.fillStyle = 'rgba(255,255,255,.035)'; g.fillRect(b.x, L.hz - b.h, 2, b.h); });
    drawB(this.far);
    const T = this.tower; g.fillStyle = '#12324f';
    g.beginPath(); g.moveTo(T.x, L.hz); g.lineTo(T.x, L.hz - T.h * .9); g.lineTo(T.x + T.w * .5, L.hz - T.h); g.lineTo(T.x + T.w, L.hz - T.h * .9); g.lineTo(T.x + T.w, L.hz); g.fill();
    g.fillRect(T.x + T.w * .5 - 1, L.hz - T.h - 26 * L.k, 2, 26 * L.k);
    drawB(this.near);
    // truss bridge (Long Bien style)
    const dk = L.hz - L.sh * .055, span = Math.max(70, L.sh * .13), hh = span * .32;
    g.strokeStyle = 'rgba(6,22,38,.95)'; g.fillStyle = 'rgba(6,22,38,.95)'; g.lineWidth = 2.2;
    for (let x = -span * .3; x < L.bridgeEnd; x += span) {
      const x1 = Math.min(x + span, L.bridgeEnd + span);
      g.beginPath(); g.moveTo(x, dk); g.quadraticCurveTo((x + x1) / 2, dk - hh * 2, x1, dk); g.stroke();
      for (let k = 1; k < 6; k++) { const xa = x + (x1 - x) * k / 6, ya = dk - 4 * hh * (k / 6) * (1 - k / 6); g.beginPath(); g.moveTo(xa, dk); g.lineTo(xa, ya); g.stroke(); const xb = x + (x1 - x) * (k + 1) / 6; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, dk); g.stroke(); }
      g.fillRect(x1 - 4, dk, 8, L.hz - dk + 6);
    }
    g.fillRect(-10, dk - 2, L.bridgeEnd + 10, 5);
    // water
    gr = g.createLinearGradient(0, L.hz, 0, H);
    gr.addColorStop(0, '#2b5470'); gr.addColorStop(.12, '#143a5c'); gr.addColorStop(1, '#071c30');
    g.fillStyle = gr; g.fillRect(0, L.hz, W, H - L.hz);
    gr = g.createRadialGradient(W * .32, L.hz, 0, W * .32, L.hz, W * .5);
    gr.addColorStop(0, 'rgba(242,190,110,.18)'); gr.addColorStop(1, 'rgba(242,190,110,0)');
    g.fillStyle = gr; g.fillRect(0, L.hz, W, H - L.hz);
    g.fillStyle = 'rgba(230,240,220,.18)'; g.fillRect(0, L.hz, W, 1);
    // foreground: embankment, railing, trees, lamp, station hardware
    this.fg = null;
    if (!L.hero) return;
    const [fg, f] = mk(); this.fg = fg;
    // trees behind railing
    f.fillStyle = '#14402f';
    for (let i = 0; i < 9; i++) { const tx = L.x0 + 20 + i * (W - L.x0) / 8 + (i % 2) * 12, tr = 26 * L.k + (i % 3) * 10 * L.k; f.beginPath(); f.arc(tx, L.wt - tr * .8, tr, 0, 7); f.arc(tx + tr * .7, L.wt - tr * .5, tr * .75, 0, 7); f.fill(); }
    f.fillStyle = '#0b2b20'; for (let i = 0; i < 9; i++) { const tx = L.x0 + 20 + i * (W - L.x0) / 8 + (i % 2) * 12; f.fillRect(tx - 2, L.wt - 30 * L.k, 4, 30 * L.k); }
    // wall face
    gr = f.createLinearGradient(L.x0, 0, W, 0);
    gr.addColorStop(0, '#3b5568'); gr.addColorStop(1, '#4b687c');
    f.fillStyle = gr;
    f.beginPath(); f.moveTo(L.x0 - 18 * L.k, L.wy); f.lineTo(L.x0, L.wt); f.lineTo(W + 2, L.wt); f.lineTo(W + 2, L.wy); f.fill();
    f.fillStyle = '#7b97a8'; f.fillRect(L.x0 - 2, L.wt - 7 * L.k, W - L.x0 + 4, 7 * L.k);
    f.strokeStyle = 'rgba(10,26,40,.45)'; f.lineWidth = 1.2;
    const rh = 22 * L.k;
    for (let y = L.wt + rh, row = 0; y < L.wy; y += rh, row++) {
      f.beginPath(); f.moveTo(L.x0 - 18 * L.k * (y - L.wt) / (L.wy - L.wt), y); f.lineTo(W, y); f.stroke();
      for (let x = L.x0 + (row % 2) * 30 * L.k; x < W; x += 60 * L.k) { f.beginPath(); f.moveTo(x, y - rh); f.lineTo(x, y); f.stroke(); }
    }
    // stain under outfall
    gr = f.createLinearGradient(0, L.oy, 0, L.wy);
    gr.addColorStop(0, 'rgba(16,24,34,.55)'); gr.addColorStop(1, 'rgba(16,24,34,0)');
    f.fillStyle = gr; f.fillRect(L.ox - L.r * .9, L.oy, L.r * 1.8, L.wy - L.oy);
    // wall reflection in water
    gr = f.createLinearGradient(0, L.wy, 0, L.wy + L.sh * .12);
    gr.addColorStop(0, 'rgba(5,18,32,.55)'); gr.addColorStop(1, 'rgba(5,18,32,0)');
    f.fillStyle = gr; f.fillRect(L.x0 - 18 * L.k, L.wy, W, L.sh * .12);
    // railing
    f.strokeStyle = '#a9c4d4'; f.lineWidth = 2;
    f.beginPath(); f.moveTo(L.x0, L.wt - 24 * L.k); f.lineTo(W, L.wt - 24 * L.k); f.stroke();
    f.lineWidth = 1.5; for (let x = L.x0 + 6; x < W; x += 22 * L.k) { f.beginPath(); f.moveTo(x, L.wt - 7 * L.k); f.lineTo(x, L.wt - 24 * L.k); f.stroke(); }
    // street lamp
    const lx = L.x0 + (W - L.x0) * .15;
    f.strokeStyle = '#0a2238'; f.lineWidth = 4; f.beginPath(); f.moveTo(lx, L.wt - 7 * L.k); f.lineTo(lx, L.wt - 110 * L.k); f.quadraticCurveTo(lx, L.wt - 122 * L.k, lx + 16 * L.k, L.wt - 122 * L.k); f.stroke();
    this.lamp = { x: lx + 16 * L.k, y: L.wt - 118 * L.k };
    // outfall pipe
    f.fillStyle = '#7d99ab'; f.beginPath(); f.arc(L.ox, L.oy, L.r * 1.28, 0, 7); f.fill();
    f.fillStyle = '#2b4558'; f.beginPath(); f.arc(L.ox, L.oy, L.r * 1.08, 0, 7); f.fill();
    gr = f.createRadialGradient(L.ox, L.oy - L.r * .3, L.r * .1, L.ox, L.oy, L.r);
    gr.addColorStop(0, '#02070d'); gr.addColorStop(1, '#0c1a26');
    f.fillStyle = gr; f.beginPath(); f.arc(L.ox, L.oy, L.r, 0, 7); f.fill();
    // station pole + panel + box
    f.fillStyle = '#9fb2c2'; f.fillRect(L.px - 3 * L.k, L.pt, 6 * L.k, L.wt - L.pt - 6 * L.k);
    const pw = 92 * L.k, ph = 34 * L.k, pty = L.pt;
    this.panel = { x: L.px - pw * .55, y: pty - ph * .6, w: pw, h: ph };
    f.save(); f.translate(L.px, pty); f.rotate(-.14);
    gr = f.createLinearGradient(-pw / 2, -ph / 2, pw / 2, ph / 2); gr.addColorStop(0, '#2f6d8a'); gr.addColorStop(1, '#10364a');
    f.fillStyle = gr; f.fillRect(-pw / 2, -ph, pw, ph);
    f.strokeStyle = 'rgba(159,212,230,.55)'; f.lineWidth = 1;
    for (let i = 1; i < 6; i++) { f.beginPath(); f.moveTo(-pw / 2 + pw * i / 6, -ph); f.lineTo(-pw / 2 + pw * i / 6, 0); f.stroke(); }
    f.beginPath(); f.moveTo(-pw / 2, -ph / 2); f.lineTo(pw / 2, -ph / 2); f.stroke();
    f.strokeStyle = '#9fd4e6'; f.lineWidth = 1.6; f.strokeRect(-pw / 2, -ph, pw, ph);
    f.restore();
    f.fillStyle = '#e9eef3'; this.round(f, L.px - L.bw / 2, L.by, L.bw, L.bh, 5 * L.k); f.fill();
    f.fillStyle = '#c3cdd6'; f.fillRect(L.px - L.bw / 2, L.by, L.bw, 8 * L.k);
    f.fillStyle = '#0b2238'; f.fillRect(L.px - L.bw / 2 + 6 * L.k, L.by + 14 * L.k, L.bw - 12 * L.k, 10 * L.k);
    f.strokeStyle = '#9fb2c2'; f.lineWidth = 2; f.beginPath(); f.moveTo(L.px + L.bw / 2 - 6 * L.k, L.by); f.lineTo(L.px + L.bw / 2 - 6 * L.k, L.by - 22 * L.k); f.stroke();
    // cable arm from box down the wall to the probe in the outflow
    f.strokeStyle = '#d4dce3'; f.lineWidth = 4 * L.k; f.lineCap = 'round';
    f.beginPath(); f.moveTo(L.px, L.by + L.bh); f.lineTo(L.px, L.wt + 18 * L.k);
    f.quadraticCurveTo(L.px, L.wt + 34 * L.k, L.px - 16 * L.k, L.wt + 40 * L.k);
    f.lineTo(L.probe.x + 10 * L.k, L.probe.y - 26 * L.k); f.stroke();
    f.lineCap = 'butt';
  }
  round(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  intensity(p) {
    if (p < 4) return 0; if (p < 5.6) return (p - 4) / 1.6; if (p < 12) return 1; if (p < 13.6) return 1 - (p - 12) / 1.6; return 0;
  }
  sample(t) {
    const S = this.st, I = S.I, n = (a) => (Math.sin(t * 3.1 + a) * .5 + Math.sin(t * 7.3 + a) * .5);
    S.v = { ph: 7.2 + 2.2 * I + n(1) * .08, do: 5.2 - 3.1 * I + n(2) * .08, ntu: 38 + 118 * I + n(3) * 3 };
    const bad = S.v.ph > 8.5 || S.v.ph < 6 || S.v.do < 4 || S.v.ntu > 57;
    if (bad) { S.n++; S.clean = 0; if (!S.alert && S.n >= 3) { S.alert = true; S.alertAt = t; this.emit(t); } }
    else { S.n = 0; if (S.alert && ++S.clean >= 2) S.alert = false; }
    this.o.onState && this.o.onState(S);
  }
  emit(t) {
    const L = this.L, from = { x: L.px + L.bw / 2 - 6 * L.k, y: L.by - 22 * L.k };
    const targets = [this.tower.x + this.tower.w / 2, this.W * .08, this.W * .48, this.W * .18].map(x => ({ x, y: L.hz - L.sh * .12 }));
    targets.forEach((to, i) => this.sig.push({ from, to, t0: t + i * .25, dur: 1.3 + i * .15 }));
  }
  start() { if (this.on) return; if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.draw(10.5); return; } this.on = true; this.last = performance.now(); requestAnimationFrame(this.frame); }
  stop() { this.on = false; }
  frame(now) {
    if (!this.on) return;
    const dt = Math.min(.05, (now - this.last) / 1000); this.last = now; this.t += dt;
    this.draw(this.t, dt); requestAnimationFrame(this.frame);
  }
  draw(t, dt = 0) {
    if (!this.bg) return;
    const c = this.c, L = this.L, W = this.W, H = this.H;
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(this.bg, 0, 0); c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const S = this.st, p = t % 18;
    if (L.hero) {
      S.I = this.intensity(p);
      const s = Math.floor(t / 2);
      if (s !== S.lastS) { S.lastS = s; this.sample(t); }
    }
    // stars
    for (const s of this.stars) { c.globalAlpha = .25 + .35 * (.5 + .5 * Math.sin(t * 1.3 + s.ph)); c.fillStyle = '#e8f0f8'; c.fillRect(s.x, s.y, s.r, s.r); }
    // windows + alert flashes
    const flashOn = L.hero && S.alert && t - S.alertAt > 1.2 && t - S.alertAt < 5;
    for (const w of this.wins) {
      let a = w.a * (.65 + .35 * Math.sin(t * w.f + w.ph));
      c.globalAlpha = a; c.fillStyle = w.warm ? '#f6d38b' : '#bfe6ef';
      if (flashOn && Math.sin(w.ph * 13) > .35) { c.fillStyle = '#ff6b57'; c.globalAlpha = .55 + .45 * Math.abs(Math.sin(t * 6 + w.ph)); }
      c.fillRect(w.x, w.y, w.w, w.h);
    }
    // bridge lamps
    const dk = L.hz - L.sh * .055;
    for (let x = 10, i = 0; x < L.bridgeEnd; x += 34, i++) { c.globalAlpha = .55 + .45 * Math.sin(t * 2 + i); c.drawImage(this.spWarm, x - 5, dk - 6, 10, 10); }
    // reflections of city lights
    for (const w of this.refl) {
      const len = (L.H - L.hz) * .35;
      for (let k = 0; k < 7; k++) {
        const y = L.hz + 4 + k * len / 7, sx = Math.sin(t * 1.6 + w.ph + k * .9) * (2 + k * 1.2);
        c.globalAlpha = w.a * .22 * (1 - k / 7); c.fillStyle = w.warm ? '#f6d38b' : '#bfe6ef';
        c.fillRect(w.x + sx, y, w.w + 2 + k * .6, 1.4);
      }
    }
    // waves
    c.lineCap = 'round';
    for (const r of this.rows) {
      c.globalAlpha = r.a; c.strokeStyle = '#dbeaf5'; c.lineWidth = .8 + r.d * 1.6;
      const shift = (t * r.v + r.off) % r.sp;
      c.beginPath();
      for (let x = -r.sp + shift - r.len; x < W + r.len; x += r.sp) { const y = r.y + Math.sin(x * .02 + t * 1.4 + r.off) * (1 + r.d * 3); c.moveTo(x, y); c.lineTo(x + r.len * (.5 + .5 * Math.sin(x * .013 + r.off)), y); }
      c.stroke();
    }
    c.globalAlpha = 1;
    if (!L.hero) return;
    // foreground wall + station
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(this.fg, 0, 0); c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    // lamp glow
    c.globalAlpha = .55; c.drawImage(this.spWarm, this.lamp.x - 40 * L.k, this.lamp.y - 30 * L.k, 80 * L.k, 80 * L.k); c.globalAlpha = 1;
    // outflow stream
    const I = S.I, mx = L.ox, my = L.oy + L.r * .55, ix = L.imp.x, iy = L.imp.y, sw = L.r * (.32 + .78 * I);
    const col = (a) => `rgba(${Math.round(140 - 70 * I)},${Math.round(200 - 145 * I)},${Math.round(236 - 200 * I)},${a})`;
    c.fillStyle = col(.75);
    c.beginPath(); c.moveTo(mx - sw / 2, my); c.quadraticCurveTo(mx - sw * .5, (my + iy) / 2, ix - sw * .7, iy); c.lineTo(ix + sw * .7, iy); c.quadraticCurveTo(mx + sw * .5, (my + iy) / 2, mx + sw / 2, my); c.fill();
    c.strokeStyle = I > .3 ? `rgba(255,140,110,${.35 * I})` : 'rgba(230,245,250,.35)'; c.lineWidth = 1.2;
    for (let k = 0; k < 5; k++) { const ph = (t * 1.6 + k / 5) % 1, x = mx + (k - 2) * sw * .18; c.globalAlpha = .6 * (1 - ph); c.beginPath(); c.moveTo(x, my + (iy - my) * ph); c.lineTo(x - sw * .05, my + (iy - my) * Math.min(1, ph + .12)); c.stroke(); }
    c.globalAlpha = 1;
    // splash rings
    for (let k = 0; k < 3; k++) { const ph = (t * .9 + k / 3) % 1; c.globalAlpha = (1 - ph) * (.25 + .4 * I); c.strokeStyle = I > .3 ? '#d9a78a' : '#e6f4f1'; c.lineWidth = 1.4; c.beginPath(); c.ellipse(ix, iy + 2, L.r * (.4 + ph * 2.4), L.r * (.12 + ph * .5), 0, 0, 7); c.stroke(); }
    c.globalAlpha = 1;
    // plume particles
    const spawn = dt * (5 + 46 * I);
    this.acc = (this.acc || 0) + spawn;
    while (this.acc > 1) {
      this.acc--;
      this.ps.push({ x: ix + (Math.random() - .5) * sw, y: iy + Math.random() * 4, vx: -(38 + Math.random() * 52) * L.k, vy: (Math.random() - .15) * 9 * L.k, r: (5 + Math.random() * 7) * L.k, gr: (7 + Math.random() * 9) * L.k, life: 0, max: 7 + Math.random() * 6, wob: Math.random() * 6, kind: I > .25 ? (Math.random() < .26 ? 'foam' : Math.random() < .3 ? 'coral' : 'brown') : 'clean' });
    }
    if (this.ps.length > 420) this.ps.splice(0, this.ps.length - 420);
    for (let i = this.ps.length - 1; i >= 0; i--) {
      const q = this.ps[i]; q.life += dt;
      if (q.life > q.max) { this.ps.splice(i, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.r += q.gr * dt;
      const floor = q.x > L.x0 - 20 ? iy : L.hz + (iy - L.hz) * .55;
      if (q.y < floor) { q.y = floor; q.vy = Math.abs(q.vy); }
      const f = q.life / q.max, a = (f < .15 ? f / .15 : 1 - (f - .15) / .85), wy2 = q.y + Math.sin(t * 1.3 + q.wob) * 1.5 * L.k, rw = q.r * 3.2, rh = q.r * .55;
      if (q.kind === 'clean') { c.globalAlpha = a * .09; c.drawImage(this.spFoam, q.x - rw / 2, wy2 - rh / 2, rw, rh); }
      else if (q.kind === 'foam') { c.globalAlpha = a * .7; c.drawImage(this.spFoam, q.x - q.r * .5, wy2 - q.r * .12, q.r, q.r * .24); }
      else { c.globalAlpha = a * (q.kind === 'coral' ? .18 : .30); c.drawImage(q.kind === 'coral' ? this.spCoral : this.spBrown, q.x - rw / 2, wy2 - rh / 2, rw, rh); }
    }
    c.globalAlpha = 1;
    // probe cage in the flow
    const pr = L.probe;
    c.save(); c.translate(pr.x, pr.y); c.rotate(.42);
    c.fillStyle = S.alert ? '#ff6b57' : '#c8f169'; this.round(c, -7 * L.k, -18 * L.k, 14 * L.k, 34 * L.k, 6 * L.k); c.fill();
    c.strokeStyle = '#e8eee9'; c.lineWidth = 1.6; this.round(c, -11 * L.k, -22 * L.k, 22 * L.k, 42 * L.k, 8 * L.k); c.stroke();
    c.restore();
    // LED
    const state = S.alert ? 'alert' : S.n > 0 ? 'check' : 'ok', ledC = { ok: '#c8f169', check: '#f2a541', alert: '#ff6b57' }[state];
    const blink = state === 'ok' ? 1 : (Math.sin(t * (state === 'alert' ? 14 : 7)) > 0 ? 1 : .25);
    c.globalAlpha = .7 * blink; c.drawImage(state === 'ok' ? this.spLime : this.spGlow, L.px - 16 * L.k, L.by + 34 * L.k - 12 * L.k, 32 * L.k, 32 * L.k);
    c.globalAlpha = blink; c.fillStyle = ledC; c.beginPath(); c.arc(L.px, L.by + 34 * L.k + 4 * L.k, 4 * L.k, 0, 7); c.fill(); c.globalAlpha = 1;
    // solar glint
    const gp = (t % 7) / 7;
    if (gp < .25) { const P = this.panel, gx = P.x + P.w * gp * 4; c.save(); c.translate(L.px, L.pt); c.rotate(-.14); c.translate(-L.px, -L.pt); c.globalAlpha = .45 * Math.sin(gp * 4 * Math.PI); c.fillStyle = '#e8f6ff'; c.beginPath(); c.moveTo(gx, L.pt - P.h); c.lineTo(gx + 10, L.pt - P.h); c.lineTo(gx - 4, L.pt); c.lineTo(gx - 14, L.pt); c.fill(); c.restore(); c.globalAlpha = 1; }
    // alert rings from the antenna
    if (S.alert && t - S.alertAt < 4.5) {
      const ax = L.px + L.bw / 2 - 6 * L.k, ay = L.by - 22 * L.k;
      for (let k = 0; k < 3; k++) { const ph = ((t - S.alertAt) * .9 + k / 3) % 1; c.globalAlpha = (1 - ph) * .8; c.strokeStyle = '#ff6b57'; c.lineWidth = 2; c.beginPath(); c.arc(ax, ay, 8 + ph * 120 * L.k, 0, 7); c.stroke(); }
      c.globalAlpha = 1;
    }
    // signals travelling to the city
    for (let i = this.sig.length - 1; i >= 0; i--) {
      const s = this.sig[i], k = (t - s.t0) / s.dur;
      if (k > 1.15) { this.sig.splice(i, 1); continue; }
      if (k < 0) continue;
      const kk = Math.min(1, k), cx = (s.from.x + s.to.x) / 2, cy = Math.min(s.from.y, s.to.y) - L.sh * .22;
      const bx = (1 - kk) ** 2 * s.from.x + 2 * (1 - kk) * kk * cx + kk ** 2 * s.to.x, by = (1 - kk) ** 2 * s.from.y + 2 * (1 - kk) * kk * cy + kk ** 2 * s.to.y;
      c.globalAlpha = .35; c.strokeStyle = '#ff8a78'; c.setLineDash([4, 6]); c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(s.from.x, s.from.y); c.quadraticCurveTo(cx, cy, s.to.x, s.to.y); c.stroke(); c.setLineDash([]);
      c.globalAlpha = 1; c.drawImage(this.spGlow, bx - 14, by - 14, 28, 28); c.fillStyle = '#fff'; c.beginPath(); c.arc(bx, by, 2.6, 0, 7); c.fill();
      if (k >= 1) { const g2 = (k - 1) / .15; c.globalAlpha = 1 - g2; c.strokeStyle = '#ff6b57'; c.lineWidth = 2; c.beginPath(); c.arc(s.to.x, s.to.y, 6 + g2 * 30, 0, 7); c.stroke(); c.globalAlpha = 1; }
    }
    // readout tag beside the station box
    this.tag(c, t, S, state);
  }
  tag(c, t, S, state) {
    const L = this.L, k = Math.min(1, L.k * 1.05), lines = [
      state === 'alert' ? 'NH-04 · ALERT SENT' : state === 'check' ? `NH-04 · checking ${S.n}/3` : 'NH-04 · normal',
      `pH ${S.v.ph.toFixed(1)}   DO ${S.v.do.toFixed(1)}   ${Math.round(S.v.ntu)} NTU`
    ];
    c.font = `700 ${Math.round(13 * k + 1)}px "Public Sans", Arial, sans-serif`;
    const w1 = c.measureText(lines[0]).width; c.font = `600 ${Math.round(12 * k + 1)}px "IBM Plex Mono", Menlo, monospace`;
    const w2 = c.measureText(lines[1]).width, w = Math.max(w1, w2) + 26, h = 50 * k + 6;
    let x = L.px - L.bw / 2 - 14 - w, y = L.by - 4;
    if (L.portrait) { x = Math.max(12, L.px - L.bw / 2 - 14 - w); }
    const col = { ok: '#c8f169', check: '#f2a541', alert: '#ff6b57' }[state];
    c.fillStyle = 'rgba(4,16,30,.86)'; this.round(c, x, y, w, h, 10); c.fill();
    c.strokeStyle = col; c.lineWidth = 1.5; this.round(c, x, y, w, h, 10); c.stroke();
    c.beginPath(); c.moveTo(x + w, y + h / 2); c.lineTo(L.px - L.bw / 2, y + h / 2); c.stroke();
    c.fillStyle = col; c.beginPath(); c.arc(x + 14, y + 17 * k + 1, 4, 0, 7); c.fill();
    c.fillStyle = '#f4f7f2'; c.font = `700 ${Math.round(13 * k + 1)}px "Public Sans", Arial, sans-serif`; c.textBaseline = 'middle';
    c.fillText(lines[0], x + 24, y + 17 * k + 1);
    c.fillStyle = state === 'ok' ? '#c4d3de' : col; c.font = `600 ${Math.round(12 * k + 1)}px "IBM Plex Mono", Menlo, monospace`;
    c.fillText(lines[1], x + 13, y + 37 * k + 3);
    c.textBaseline = 'alphabetic';
  }
};
