const $ = id => document.getElementById(id), NS = 'http://www.w3.org/2000/svg';
    // Sensor-only experimental rule supplied by the project team.
    function turbidityLimit(values) {
      return values.do >= 4.2 && values.tds <= 400 ? 75 : 50;
    }

    const P = [
      { k: 'ph', n: 'pH', min: 0, max: 14, st: .05, d: 2, u: '', bad: v => v < 6 || v > 8.5, base: 7.2, x: 20, y: 40, c: '#22c55e', pin: 3, knob: '#3b82f6' },
      { k: 'turb', n: 'Turbidity', min: 0, max: 250, st: 1, d: 1, u: 'NTU', bad: v => v > turbidityLimit(V), base: 20, x: 20, y: 120, c: '#38bdf8', pin: 4, knob: '#8b5cf6' },
      { k: 'do', n: 'Dissolved O2', min: 0, max: 12, st: .1, d: 2, u: 'mg/L', bad: v => v < 4, base: 7, x: 20, y: 200, c: '#facc15', pin: 5, knob: '#14b8a6' },
      { k: 'tds', n: 'TDS', min: 0, max: 2000, st: 10, d: 0, u: 'ppm', bad: v => v > 500, base: 400, x: 20, y: 280, c: '#c084fc', pin: 6, knob: '#f97316' },
      { k: 'temp', n: 'DS18B20 Temp', min: 0, max: 60, st: .1, d: 1, u: '°C', bad: v => v > 35, base: 28.5, x: 545, y: 200, knob: '#ef4444' }
    ];
    const spill = { ph: 4.8, turb: 130, do: 2.2, tds: 1400, temp: 38 };
    const V = {}; P.forEach(p => V[p.k] = p.base);

    function assessment() {
      const limit = turbidityLimit(V);
      const reasons = [];
      if (V.ph < 6 || V.ph > 8.5) reasons.push('pH outside 6.00–8.50');
      if (V.turb > limit) reasons.push(`Turbidity > ${limit} NTU`);
      if (V.do < 4) reasons.push('DO < 4.00 mg/L');
      if (V.tds > 500) reasons.push('TDS > 500 ppm');
      if (V.temp > 35) reasons.push('Temperature > 35.0 °C');
      return { limit, reasons, breached: reasons.length > 0 };
    }
    const LP = i => [308, 190 + 18 * i], RP = i => [462, 190 + 18 * i];
    const L = ['EN', 'VP', 'VN', 'D34', 'D35', 'D32', 'D33', 'D25', 'D26', 'D27', 'D14', 'D12', 'D13', 'GND', 'VIN'];
    const R = ['D23', 'D22', 'TX0', 'RX0', 'D21', 'D19', 'D18', 'D5', 'TX2', 'RX2', 'D4', 'D2', 'D15', 'GND', '3V3'];
    const W = (a, b, c, dx = 70) => `<path d="M${a[0]} ${a[1]} C${a[0] + dx} ${a[1]},${b[0] - dx} ${b[1]},${b[0]} ${b[1]}" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/><circle cx="${a[0]}" cy="${a[1]}" r="3.5" fill="${c}"/><circle cx="${b[0]}" cy="${b[1]}" r="3.5" fill="${c}"/>`;
    let w = '', s = '';

    // ESP32 board
    s += `<rect x="300" y="30" width="170" height="450" rx="8" fill="#1d2b3a" stroke="#0f1822" stroke-width="2"/>
    <rect x="372" y="468" width="26" height="30" rx="3" fill="url(#mg)" transform="translate(-5 0)"/><rect x="380" y="468" width="46" height="30" rx="3" fill="url(#mg)" stroke="#555"/><rect x="391" y="480" width="24" height="8" fill="#222"/>
    <rect x="345" y="44" width="80" height="32" fill="#10151c"/><path d="M350 70h10v-18h10v18h10v-18h10v18h10v-18h10v18h10" fill="none" stroke="#d4af37" stroke-width="2"/>
    <rect x="345" y="78" width="80" height="94" rx="3" fill="url(#mg)" stroke="#6b7280"/><text x="385" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#374151">ESP32</text><text x="385" y="126" text-anchor="middle" font-size="8" fill="#374151">WROOM-32</text><text x="385" y="160" text-anchor="middle" font-size="7" fill="#4b5563">FCC ID 2AC7Z</text>
    <rect x="366" y="408" width="38" height="38" fill="#0b0b0d"/><text x="385" y="431" text-anchor="middle" font-size="7" fill="#aaa">CP2102</text>
    <rect x="322" y="450" width="22" height="14" rx="2" fill="#bbb"/><text x="333" y="446" text-anchor="middle" font-size="7" fill="#ddd">EN</text><rect x="426" y="450" width="22" height="14" rx="2" fill="#bbb"/><text x="437" y="446" text-anchor="middle" font-size="7" fill="#ddd">BOOT</text>
    <circle cx="350" cy="190" r="3" fill="#ef4444"/><circle id="blue" cx="420" cy="190" r="3" fill="#1e3a8a"/>`;

    L.forEach((t, i) => { const [x, y] = LP(i); s += `<circle cx="${x}" cy="${y}" r="4.5" fill="#d4af37"/><circle cx="${x}" cy="${y}" r="1.6" fill="#222"/><text class="pin" x="${x + 10}" y="${y + 3}">${t}</text>` });
    R.forEach((t, i) => { const [x, y] = RP(i); s += `<circle cx="${x}" cy="${y}" r="4.5" fill="#d4af37"/><circle cx="${x}" cy="${y}" r="1.6" fill="#222"/><text class="pin" x="${x - 10}" y="${y + 3}" text-anchor="end">${t}</text>` });

    // Sliders (pots) + Ô nhập số trực tiếp (foreignObject)
    P.forEach(p => {
      s += `<g id="g${p.k}">
        <text class="lb" x="${p.x}" y="${p.y - 7}">${p.n}</text>
        <foreignObject x="${p.x + 74}" y="${p.y - 22}" width="72" height="20">
          <div xmlns="http://www.w3.org/1999/xhtml" class="vin-wrap" id="vw${p.k}">
            <input class="vin" id="in${p.k}" type="number" min="${p.min}" max="${p.max}" step="${p.st}" aria-label="${p.n}"/>
            ${p.u ? `<span>${p.u}</span>` : ''}
          </div>
        </foreignObject>
        <rect x="${p.x}" y="${p.y}" width="140" height="28" rx="3" fill="#d6d6d6" stroke="#8a8a8a"/>
        <rect x="${p.x + 10}" y="${p.y + 12}" width="120" height="4" rx="2" fill="#444"/>
        <rect class="sk" id="kn${p.k}" y="${p.y + 3}" width="14" height="22" rx="2" fill="${p.knob}" stroke="#111"/>
        <rect class="sk" id="hit${p.k}" x="${p.x}" y="${p.y - 4}" width="140" height="36" fill="transparent"/>
        ${p.k === 'temp' ? '' : [40, 70, 100].map((o, j) => `<rect x="${p.x + o - 3}" y="${p.y + 28}" width="6" height="9" fill="${['#111', '#d4af37', '#dc2626'][j] === '#111' ? '#888' : '#d4af37'}"/>`).join('')}
      </g>`;
      if (p.k !== 'temp') w += W([p.x + 70, p.y + 37], LP(p.pin), p.c, 90);
    });

    // LEDs + resistors
    [['g', 8, 400, '#22c55e'], ['r', 9, 460, '#ef4444']].forEach(([k, pi, y, c]) => {
      s += `<rect x="105" y="${y - 6}" width="46" height="12" rx="5" fill="#d9c9a3" stroke="#8b7b55"/>${['#dc2626', '#dc2626', '#7c3f00', '#d4af37'].map((b, i) => `<rect x="${112 + i * 8}" y="${y - 6}" width="3" height="12" fill="${b}"/>`).join('')}
      <text class="lb" x="105" y="${y - 12}">220 Ω</text>
      <circle id="gl${k}" cx="215" cy="${y}" r="22" fill="${c}" filter="url(#gl)" opacity="0"/>
      <g transform="translate(215 ${y})"><rect x="-4" y="14" width="3" height="16" fill="#aaa"/><rect x="5" y="14" width="3" height="10" fill="#aaa"/><rect x="-14" y="6" width="28" height="8" fill="${c}" opacity=".55"/><path d="M-12 6V-8a12 12 0 0 1 24 0V6z" id="led${k}" fill="${c}" opacity=".35" stroke="#0004"/></g>
      <text class="lb" x="236" y="${y + 4}">${k === 'g' ? 'Green' : 'Red'} LED</text>`;
      w += W(LP(pi), [105, y], k === 'g' ? '#16a34a' : '#ef4444', 60) + `<path d="M151 ${y} H208" stroke="#aaa" stroke-width="3"/>` + W([215, y + 30], LP(13), '#111', 60);
    });

    // DS18B20 TO-92
    s += `<g transform="translate(565 300)"><path d="M-26 0a26 26 0 0 1 52 0v8h-52z" fill="#15181d" stroke="#000"/><text y="-4" text-anchor="middle" font-size="9" fill="#ddd">DS18B20</text><text y="6" text-anchor="middle" font-size="7" fill="#888">1-Wire</text>
    ${[-16, 0, 16].map(o => `<rect x="${o - 1.5}" y="8" width="3" height="28" fill="#c9c9c9"/>`).join('')}</g>`;
    w += W([549, 336], RP(13), '#111', -60) + W([565, 336], RP(10), '#facc15', -60) + W([581, 336], RP(14), '#ef4444', -60);
    w += `<text class="pin" x="539" y="352" fill="#fff">GND</text><text class="pin" x="560" y="352" fill="#fff">DQ</text><text class="pin" x="577" y="352" fill="#fff">VCC</text>`;

    // Breach counter box
    s += `<g transform="translate(545 410)"><rect width="150" height="64" rx="6" fill="#1b1d22" stroke="#555"/><text class="lb" x="75" y="22" text-anchor="middle" fill="#fff">breachCount</text><text id="cnt" x="75" y="52" text-anchor="middle" font-size="26" font-weight="700" fill="#fff">0/3</text></g>`;
    $('wires').innerHTML = w; $('parts').innerHTML = s;

    // Slider & Input interaction
    const svg = $('svg');
    function knob(p) {
      const f = (V[p.k] - p.min) / (p.max - p.min);
      $('kn' + p.k).setAttribute('x', p.x + 10 + f * 106);
    }

    P.forEach(p => {
      // 1. Kéo thanh trượt bằng chuột/cảm ứng
      const h = $('hit' + p.k);
      const mv = e => {
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        const q = pt.matrixTransform(svg.getScreenCTM().inverse());
        let f = Math.max(0, Math.min(1, (q.x - p.x - 17) / 106));
        let v = p.min + f * (p.max - p.min);
        V[p.k] = Math.round(v / p.st) * p.st;
        setMode('manual');
        draw();
      };
      h.addEventListener('pointerdown', e => { h.setPointerCapture(e.pointerId); mv(e); h.onpointermove = mv; });
      h.addEventListener('pointerup', () => h.onpointermove = null);

      // 2. Nhập số trực tiếp từ bàn phím -> cập nhật thanh kéo
      const inp = $('in' + p.k);
      inp.addEventListener('input', () => {
        const raw = parseFloat(inp.value);
        if (isNaN(raw)) return;
        V[p.k] = Math.max(p.min, Math.min(p.max, raw));
        setMode('manual');
        draw();
      });

      const commit = () => {
        const raw = parseFloat(inp.value);
        if (!isNaN(raw)) {
          V[p.k] = Math.max(p.min, Math.min(p.max, raw));
          setMode('manual');
        }
        draw();
      };
      inp.addEventListener('change', commit);
      inp.addEventListener('blur', commit);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') inp.blur(); });
    });

    // Controls
    const M = { normal: 'Normal', spill: 'Spill', random: 'Random', manual: 'Manual' };
    let mode = 'normal', speed = 1, run = true, rnd = 0;
    $('modes').innerHTML = Object.keys(M).map(k => `<button data-m="${k}">${M[k]}</button>`).join(' ');
    $('spd').innerHTML = [1, 3, 10].map(x => `<button data-s="${x}">x${x}</button>`).join(' ');
    function setMode(m) { mode = m; [...$('modes').children].forEach(b => b.classList.toggle('on', b.dataset.m === m)); rnd = 0; }
    $('modes').onclick = e => e.target.dataset.m && setMode(e.target.dataset.m);
    $('spd').onclick = e => { if (e.target.dataset.s) { speed = +e.target.dataset.s; [...$('spd').children].forEach(b => b.classList.toggle('on', +b.dataset.s === speed)); } };
    $('spd').children[0].classList.add('on'); setMode('normal');
    $('run').onclick = () => { run = !run; $('run').textContent = run ? '⏸ Pause' : '▶ Run'; $('run').className = run ? 'run' : ''; };
    document.querySelector('.tabs').onclick = e => {
      const t = e.target.dataset.t; if (!t) return;
      [...e.currentTarget.children].forEach(b => b.classList.toggle('on', b === e.target));
      $('ser').hidden = t !== 'ser'; $('ts').hidden = t !== 'ts';
    };

    function log(id, t) {
      const d = $(id); d.textContent += t + '\n';
      const l = d.textContent.split('\n');
      if (l.length > 120) d.textContent = l.slice(-100).join('\n');
      d.scrollTop = 1e9;
    }

    let cnt = 0, alert = 0, mA = 0, sA = 0, sim = 0, last = performance.now(), n = 0;
    function draw() {
      P.forEach(p => {
        knob(p);
        const inp = $('in' + p.k);
        // Không ghi đè nếu người dùng đang gõ dở trong ô đó
        if (document.activeElement !== inp) {
          inp.value = V[p.k].toFixed(p.d);
        }
        $('vw' + p.k).classList.toggle('bad', p.bad(V[p.k]));
      });
      const result = assessment();
      $('rule').textContent = `Turbidity limit: ${result.limit} NTU · ` +
        (result.limit === 75 ? 'DO ≥ 4.20 and TDS ≤ 400' : 'DO < 4.20 or TDS > 400');
      $('reason').textContent = result.breached
        ? 'Outside limits: ' + result.reasons.join('; ')
        : 'All current inputs are within the screening limits.';
      $('reason').className = result.breached ? 'reason-bad' : '';
    }

    function drive() {
      if (mode === 'manual') return;
      let t = null;
      if (mode === 'spill') t = spill;
      if (mode === 'random') {
        if (rnd <= 0 && Math.random() < .18) rnd = 5 + Math.floor(Math.random() * 5);
        if (rnd > 0) { t = spill; rnd--; }
      }
      P.forEach(p => {
        const g = t ? spill[p.k] : p.base;
        V[p.k] += (g - V[p.k]) * (t ? .35 : .3) + (Math.random() - .5) * (p.max - p.min) * .02;
        V[p.k] = Math.max(p.min, Math.min(p.max, V[p.k]));
      });
    }

    function measure() {
      drive();
      const result = assessment();
      cnt = result.breached ? Math.min(cnt + 1, 3) : 0;
      alert = cnt >= 3 ? 1 : 0;
      draw();
      const on = (id, a) => { $(id).setAttribute('opacity', a ? 1 : .35); };
      on('ledg', !alert); on('ledr', alert);
      $('glg').setAttribute('opacity', alert ? 0 : .9);
      $('glr').setAttribute('opacity', alert ? .9 : 0);
      $('cnt').textContent = cnt + '/3';
      $('cnt').style.fill = cnt ? '#ff6b6b' : '#fff';

      const c = $('chip');
      c.className = 'chip' + (alert ? ' bad' : cnt ? ' warn' : '');
      c.textContent = alert ? 'RED: THRESHOLD EXCEEDED (3/3)' : cnt ? `YELLOW: Warning ${cnt}/3` : 'GREEN: WITHIN LIMITS';

      $('blue').setAttribute('fill', '#60a5fa');
      setTimeout(() => $('blue').setAttribute('fill', '#1e3a8a'), 150);

      log('ser', `pH: ${V.ph.toFixed(2)} | Turb: ${V.turb.toFixed(1)} | DO: ${V.do.toFixed(2)} | Temp: ${V.temp.toFixed(1)} | TDS: ${V.tds.toFixed(0)} ppm | Breaches: ${cnt}/3 | Turbidity limit: ${result.limit} NTU | ${result.reasons.join('; ') || 'Within limits'}`);
    }

    function send() {
      n++;
      log('ser', '>>> Simulated ThingSpeak upload (Code 200) | Alert = ' + alert);
      log('ts', `entry #${n}  (t=${sim.toFixed(0)}s)\nGET api.thingspeak.com/update\n  field1=${V.ph.toFixed(2)}  field2=${V.turb.toFixed(1)}\n  field3=${V.do.toFixed(2)}  field4=${V.temp.toFixed(1)}\n  field5=${V.tds.toFixed(0)}  field6=${alert}\n=> ${alert ? 'CONFIRMED ALERT' : cnt ? 'PENDING WARNING (alert=0)' : 'WITHIN LIMITS'}\n`);
    }

    function boot() {
      if (document.activeElement) document.activeElement.blur();
      $('ser').textContent = 'ets Jul 29 2019 12:21:46\n\nrst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)\nconfigsip: 0, SPIWP:0xee\nConnecting to WiFi....\nWiFi connected successfully!\n';
      $('ts').textContent = '';
      cnt = 0; alert = 0; mA = 0; sA = 0; sim = 0; n = 0;
      P.forEach(p => V[p.k] = p.base);
      measure();
    }
    $('rst').onclick = boot;

    function frame(now) {
      const dt = Math.min(.25, (now - last) / 1000);
      last = now;
      if (run) {
        const d = dt * speed;
        sim += d; mA += d; sA += d;
        while (mA >= 3) { mA -= 3; measure(); }
        if (sA >= 15) { sA -= 15; send(); }
        const m = Math.floor(sim / 60), s2 = sim % 60;
        $('clk').textContent = String(m).padStart(2, '0') + ':' + s2.toFixed(3).padStart(6, '0');
        $('f1').textContent = 'Next read: ' + (3 - mA).toFixed(1) + 's';
        $('f2').textContent = 'Next upload: ' + (15 - sA).toFixed(1) + 's';
      }
      requestAnimationFrame(frame);
    }

    $('run').className = 'run';
    boot();
    requestAnimationFrame(frame);
