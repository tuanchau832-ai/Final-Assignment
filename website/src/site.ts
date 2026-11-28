// @ts-nocheck  (ported from the design prototype; typed loosely on purpose)
import { RiverScene } from './scene';

let started = false;
/** Wires up navigation, reveals, demos, charts and canvases once the page markup is in the DOM. */
export function initSite(): void {
  if (started) return;
  started = true;
{
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ================= DATA ================= */
const CRIT = [
  { k: 'Timely', w: 25, c: '#c8f169', d: 'Detects a limit breach and alerts within minutes, day or night.', why: 'Discharges happen at night; lab tests take five days.' },
  { k: 'Traceable', w: 20, c: '#4a9fd8', d: 'Links every reading to one outfall, a time and a calibration record; a lab sample confirms before any fine.', why: 'Authorities need evidence that holds up.' },
  { k: 'Reliable', w: 20, c: '#2f8f83', d: 'Keeps false alarms rare and flags faulty or missing readings.', why: 'Residents ignore alerts that are often wrong.' },
  { k: 'Clear for residents', w: 15, c: '#f2a541', d: 'Vietnamese language, colour paired with text and symbols, readable by older users.', why: 'The people most affected are often the least digital.' },
  { k: 'Durable', w: 10, c: '#8ea6b8', d: 'Survives dirty water, plastics and floods, runs on solar power and stores data offline.', why: 'Outfalls flood in the rainy season.' },
  { k: 'Affordable', w: 10, c: '#ff9b8a', d: 'Low enough cost per site to cover many outfalls, including upkeep.', why: 'The city budget is already stretched.' }
];
const OPTS = [
  { k: 'A · Sensor stations', s: [5, 5, 4, 4, 3, 3], r: ['Reads every 2 s; alerts in minutes', 'One station per outfall', 'Three-reading rule; probes can drift', 'Colour map plus SMS', 'Fouling and floods need care', 'Provisional score. Review once equipment, installation and service costs are confirmed.'] },
  { k: 'B · Test kits and app', s: [2, 2, 2, 4, 5, 4], r: ['Only when a volunteer tests', 'Tests river water, not outfalls', 'Kit accuracy and training vary', 'Residents take part directly', 'Kits are simple', 'Kits are cheap'] },
  { k: 'C · Manual sampling', s: [1, 3, 5, 2, 4, 2], r: ['Days between visits, plus lab time', 'Samples one outfall, if it is the right one', 'Laboratory accuracy', 'Results rarely reach residents', 'No equipment left on site', 'Staff time grows with every site'] },
  { k: 'D · AI + IoT', s: [], r: [] }
];
const STAKE = [
  { n: 'Environment authorities', c: '#c8f169', i: 5, need: 'Reliable evidence to target inspections and enforce discharge rules.', more: 'Hanoi People’s Committee and the Department of Agriculture and Environment receive alerts, send inspectors and issue fines.' },
  { n: 'Residents near rivers', c: '#4a9fd8', i: 2, need: 'To know whether nearby water is safe, and an easy way to report pollution.', more: 'Most affected and least informed today; older residents need alerts they understand at a glance.' },
  { n: 'Farmers and fish farmers', c: '#f2a541', i: 2, need: 'A warning before they pump river water into fields or ponds.', more: 'Includes farmers downstream in Hà Nam, where wastewater waves kill farmed fish.' },
  { n: 'Factories and cluster managers', c: '#ff9b8a', i: 4, need: 'Early warning when their treatment fails, and proof of compliance.', more: 'They may resist monitoring, but alerts also protect them from larger fines.' },
  { n: 'Environmental police', c: '#8ea6b8', i: 4, need: 'Time-stamped, location-specific records of violations.', more: 'Records must be tamper-proof and confirmed by a laboratory to support enforcement.' },
  { n: 'Water supply companies', c: '#4a9fd8', i: 3, need: 'Advance notice to adjust treatment at their intakes.', more: 'Earlier warning avoids treatment costs that push up water prices.' },
  { n: 'Researchers and NGOs', c: '#c8f169', i: 2, need: 'Open, quality-labelled data on long-term trends.', more: 'Can study pollution patterns and hold agencies to account.' },
  { n: 'Our team (IT developers)', c: '#f2a541', i: 3, need: 'A system that is maintainable, and a service contract to run it.', more: 'Builds, installs and maintains stations and the platform.' }
];
// Listed-price amounts per station from the 19–25 November evidence register.
// This ESP32 + M.2 configuration is a reference BOM, pending hardware selection.
const PH_KIT = { n: 'Industrial pH probe kit', s: 'SEN0169-V2 · price-002', p: 1683506 };
const BUILD = [
  { n: 'ESP32 board', s: 'HS2250V · price-001', p: 195000 },
  PH_KIT,
  { n: 'Dissolved-oxygen probe kit', s: 'SEN0680 · price-003', p: 4428000 },
  { n: 'Turbidity sensor', s: 'SEN0710 · price-004', p: 5940260 },
  { n: 'Waterproof temperature sensor', s: 'DS18B20 HS2432V · price-005', p: 35000 },
  { n: 'TTL–RS485 module', s: 'HS2455V · price-006', p: 35000 },
  { n: 'SIM7600G-H-M.2 modem', s: 'HS2164V · price-007', p: 1566000 },
  { n: 'Cable glands', s: '4 × ₫3,175 · PG13.5 · fit pending · price-009', p: 4 * 3175 }
];
const LIFE = [
  { k: 'Materials', imp: 'Electronics need copper, plastics and lithium for the battery.', who: 'Component suppliers', act: 'Choose RoHS-compliant parts, a stainless cage and a recyclable enclosure.' },
  { k: 'Assembly', imp: 'Assembly uses energy and creates offcuts and packaging.', who: 'Our team, local workshops', act: 'Assemble in Hanoi to cut shipping and support local jobs.' },
  { k: 'Transport', imp: 'Short trips by van; each station weighs only a few kilograms.', who: 'Our team', act: 'Group installations by district to cut trips.' },
  { k: 'Installation', imp: 'Work on embankment walls beside traffic and water.', who: 'Drainage company, ward committees, residents', act: 'Agree access, follow safety rules and tell residents before work starts.' },
  { k: 'Use', imp: 'Solar powered, but needs cleaning visits and calibration chemicals.', who: 'Inspectors, residents, factories', act: 'Collect used calibration fluid and plan visits by route.' },
  { k: 'End of life', imp: 'Retired boards and lithium batteries require appropriate e-waste handling.', who: 'Certified recycler, the Department', act: 'Review wear and corrosion in month 36, replace as needed and arrange collection at replacement or closure.' }
];
const TEAM = [
  { n: 'Nguyễn Gia Ngân', f: 'Industrial wastewater', b: 'Researched how industrial wastewater affects water quality in Hanoi, from COD and BOD₅ in the Tô Lịch to metals in river sediments.' },
  { n: 'Huỳnh Lâm Nguyên', f: 'Monitoring reliability', b: 'Focused on why discharges are recognised late, and on keeping readings reliable, traceable and clearly explained to the public.' },
  { n: 'Nguyễn Ngọc Anh Thư', f: 'Policy and budgets', b: 'Studied the causes behind the problem, from scarce monitoring and split responsibilities to the strain on Hanoi’s budget.' },
  { n: 'Nguyễn Tấn Đạt', f: 'Economic impact', b: 'Examined the economic cost of late detection for households, farmers, fisheries and the agencies that clean up.' },
  { n: 'Lê Nguyễn Bá Nguyên', f: 'Drains and outfalls', b: 'Investigated how incomplete drains in peri-urban areas and urban villages send greywater and plastics through unmonitored outfalls.' },
  { n: 'Châu Hoàng Tuấn', f: 'Research focus', b: 'Research focus and a short bio to be added.' }
];

/* ================= RENDER ================= */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => n.split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('');

$('#critGrid').innerHTML = CRIT.map((c, i) => `
  <div class="card lift reveal d${i % 3}">
    <div class="ring"><svg viewBox="0 0 76 76" aria-hidden="true"><circle class="bgc" cx="38" cy="38" r="32"/><circle class="fg" cx="38" cy="38" r="32" stroke-dasharray="201" stroke-dashoffset="201" data-w="${c.w}"/></svg><b>${c.w}%</b></div>
    <div><h3>${esc(c.k)}</h3><p>${esc(c.d)}</p><p class="why">Why: ${esc(c.why)}</p></div>
  </div>`).join('');

$('#stakeGrid').innerHTML = STAKE.map((s, i) => `
  <button type="button" class="reveal d${i % 4}" aria-expanded="false">
    <span class="who"><i style="background:${s.c}">${esc(initials(s.n))}</i>${esc(s.n)}</span>
    <span class="need">${esc(s.need)}</span>
    <span class="lvl">Influence <b>${[1, 2, 3, 4, 5].map(k => `<i class="${k <= s.i ? 'f' : ''}"></i>`).join('')}</b></span>
    <span class="more">${esc(s.more)}</span>
  </button>`).join('');
$$('#stakeGrid button').forEach(b => b.addEventListener('click', () => b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') === 'true' ? 'false' : 'true')));

/* decision matrix */
const total = o => o.s.reduce((a, v, i) => a + v * CRIT[i].w, 0) / 5;
$('#legend').innerHTML = CRIT.map(c => `<span><i style="background:${c.c}"></i>${esc(c.k)} ${c.w}%</span>`).join('');
$('#matrix').innerHTML = OPTS.map((o, oi) => {
  const scored = o.s.length === CRIT.length;
  return `
  <div class="mrow ${oi === 0 ? 'win' : ''}">
    <div class="nm">${esc(o.k)}<small>${scored ? (oi === 0 ? 'Pilot design' : 'Compared') : 'Scoring pending'}</small></div>
    <div class="mbar" role="img" aria-label="${esc(o.k)}: ${scored ? total(o) + ' out of 100' : 'not scored'}">${o.s.map((v, i) => `<i style="background:${CRIT[i].c}" data-w="${v * CRIT[i].w / 5}" title="${esc(CRIT[i].k)}: ${v}/5"></i>`).join('')}</div>
    <div class="tot">${scored ? total(o) : '—'}</div>
  </div>`;
}).join('');
const pick = $('#pick');
pick.innerHTML = OPTS.map((o, i) => `<button type="button" aria-pressed="${i === 0}" data-o="${i}">${esc(o.k)}</button>`).join('');
const showScores = i => {
  $$('button', pick).forEach(b => b.setAttribute('aria-pressed', b.dataset.o == i));
  const option = OPTS[i];
  $('#scoreDetail').innerHTML = option.s.length
    ? option.s.map((v, k) => `<div><b>${esc(CRIT[k].k)}</b><span>${v} / 5</span><em>${esc(option.r[k])}</em></div>`).join('')
    : '<p>Scores are pending. This option needs evidence against all six criteria before a weighted total can be calculated.</p>';
};
pick.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showScores(+b.dataset.o); });
showScores(0);

/* bill of materials and calculator */
const buildSum = BUILD.reduce((sum, item) => sum + item.p, 0);
const maxListedPrice = Math.max(...BUILD.map(item => item.p));
const dong = value => '₫' + fmt(value);
const priceRows = BUILD.map(x => `
  <div class="it"><div><b>${esc(x.n)}</b><small>${esc(x.s)}</small></div><div class="bar"><i data-w="${(x.p / maxListedPrice * 100).toFixed(1)}"></i></div><span class="p">${dong(x.p)}</span></div>`).join('');
const stationInput = $('#nSt');
const yearInput = $('#nYr');
const pilotStations = Number(stationInput.defaultValue);
$$('[data-hww-pilot-cost]').forEach(el => { el.textContent = dong(pilotStations * buildSum); });
$('#bomBuild').innerHTML = priceRows + `<div class="tot"><span>Listed-price subtotal per station</span><span>${dong(buildSum)}</span></div>`;
const calc = () => {
  const stations = Number(stationInput.value);
  const years = Number(yearInput.value);
  const months = 12 * years;
  const rounds = 2 * years;
  $('#nOut').textContent = stations;
  $('#yOut').textContent = years;
  $('#cFirstStation').textContent = dong(buildSum);
  $('#cRemainingStations').textContent = stations > 1 ? dong((stations - 1) * buildSum) : 'No additional stations';
  $('#cVnd').textContent = dong(stations * buildSum);
  $('#cSpare').textContent = stations <= pilotStations ? dong(PH_KIT.p) : 'Stock TBD';
  $('#cVisits').textContent = fmt(rounds * stations);
  $('#cTrips').textContent = stations === pilotStations ? fmt(rounds) : 'Route TBD';
  $('#cServices').textContent = `Simultaneous-start baseline: ${fmt(stations * months)} SIM-months and ${fmt(months)} months of shared hosting. Later starts reduce SIM-months and may change the field schedule.`;
};
stationInput.addEventListener('input', calc); yearInput.addEventListener('input', calc); calc();

/* life-cycle wheel */
const wheel = $('#wheel');
const R1 = 210, R0 = 118, seg = Math.PI * 2 / LIFE.length;
const pt = (r, a) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
wheel.innerHTML = LIFE.map((s, i) => {
  const a0 = i * seg - Math.PI / 2 + 0.02, a1 = (i + 1) * seg - Math.PI / 2 - 0.02, am = (a0 + a1) / 2;
  const d = `M${pt(R1, a0)} A${R1} ${R1} 0 0 1 ${pt(R1, a1)} L${pt(R0, a1)} A${R0} ${R0} 0 0 0 ${pt(R0, a0)}Z`;
  const tx = ((R0 + R1) / 2 * Math.cos(am)).toFixed(1), ty = ((R0 + R1) / 2 * Math.sin(am)).toFixed(1);
  return `<g class="seg" data-i="${i}" tabindex="0" role="button" aria-label="${esc(s.k)}"><path d="${d}" fill="${i % 2 ? '#1a3f63' : '#12304d'}" stroke="#0b2238" stroke-width="2"/><text x="${tx}" y="${(+ty - 4).toFixed(1)}" text-anchor="middle">${i + 1}</text><text x="${tx}" y="${(+ty + 14).toFixed(1)}" text-anchor="middle">${esc(s.k)}</text></g>`;
}).join('') + `<text class="mid" x="0" y="-6" text-anchor="middle">Station</text><text class="mid" x="0" y="22" text-anchor="middle">life cycle</text>`;
const stageBtns = $('#stageBtns');
stageBtns.innerHTML = LIFE.map((s, i) => `<button type="button" data-i="${i}" aria-pressed="false">${i + 1}. ${esc(s.k)}</button>`).join('');
const showStage = i => {
  const s = LIFE[i];
  $$('.seg', wheel).forEach(g => g.classList.toggle('on', +g.dataset.i === i));
  $$('button', stageBtns).forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === i));
  $('#stage').innerHTML = `<span class="n">Stage ${i + 1} of ${LIFE.length}</span><h3>${esc(s.k)}</h3><dl><div><dt>Impact</dt><dd>${esc(s.imp)}</dd></div><div><dt>Stakeholders</dt><dd>${esc(s.who)}</dd></div><div><dt>Our response</dt><dd>${esc(s.act)}</dd></div></dl>`;
};
wheel.addEventListener('click', e => { const g = e.target.closest('.seg'); if (g) showStage(+g.dataset.i); });
wheel.addEventListener('keydown', e => { const g = e.target.closest('.seg'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showStage(+g.dataset.i); } });
stageBtns.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showStage(+b.dataset.i); });
showStage(0);

/* team */
$('#teamGrid').innerHTML = TEAM.map((m, i) => `
  <article class="member reveal d${i % 3}">
    <div class="ph"><span>${m.ph ? '?' : esc(initials(m.n))}</span><small>Photo to be added</small></div>
    <p class="role">${esc(m.f)}</p>
    <h3>${esc(m.n)}</h3>
    <p>${esc(m.b)}</p>
    <p class="rr">Report role <span class="pending">To confirm</span></p>
  </article>`).join('');
$('#declare').innerHTML = TEAM.map(m => `<div><b>${esc(m.n)}</b><span>Sections written, prototype or research work, presentation part.</span><span class="pending">Fill in</span></div>`).join('');

/* ================= NAVIGATION ================= */
const PAGES = ['home', 'background', 'problem', 'design', 'solution', 'implementation', 'considerations', 'team', 'references', 'appendices'];
const GROUP = { home: 'home', background: 'home', problem: 'home', design: 'design', solution: 'solution', implementation: 'implementation', considerations: 'implementation', team: 'team', references: 'resources', appendices: 'resources' };
const menu = $('#menu'), burger = $('#burger');
const closeDrops = except => $$('.menu > li.open').forEach(li => { if (li !== except) { li.classList.remove('open'); const t = $('.top', li); t && t.setAttribute('aria-expanded', 'false'); } });
const desktop = () => matchMedia('(min-width: 981px)').matches;
$$('.menu > li').forEach(li => {
  const top = $('.top', li), drop = $('.drop', li);
  if (!drop) return;
  let timer;
  top.addEventListener('click', e => { e.preventDefault(); const open = !li.classList.contains('open'); closeDrops(li); li.classList.toggle('open', open); top.setAttribute('aria-expanded', open); });
  li.addEventListener('mouseenter', () => { if (!desktop()) return; clearTimeout(timer); closeDrops(li); li.classList.add('open'); top.setAttribute('aria-expanded', 'true'); });
  li.addEventListener('mouseleave', () => { if (!desktop()) return; timer = setTimeout(() => { li.classList.remove('open'); top.setAttribute('aria-expanded', 'false'); }, 180); });
});
document.addEventListener('click', e => { if (!e.target.closest('.menu')) closeDrops(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrops(); setMenu(false); } });
const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); document.body.style.overflow = open && !desktop() ? 'hidden' : ''; };
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', e => { if (e.target.closest('a')) { setMenu(false); closeDrops(); } });

let current = null;
const route = () => {
  setMenu(false); closeDrops();
  const h = decodeURIComponent(location.hash.slice(1)) || 'home';
  let page = h.split('-')[0];
  if (!PAGES.includes(page)) page = 'home';
  const changed = page !== current;
  if (changed) {
    $$('.page').forEach(p => p.classList.toggle('on', p.dataset.page === page));
    current = page;
    $$('.menu .top').forEach(t => t.toggleAttribute('aria-current', t.dataset.group === GROUP[page]));
    $$('.menu .top[aria-current]').forEach(t => t.setAttribute('aria-current', 'page'));
    document.title = page === 'home' ? 'Hanoi WaterWatch' : `${page[0].toUpperCase() + page.slice(1)} · Hanoi WaterWatch`;
    observeReveals();
    startCanvases();
    if (page === 'solution') loadFrames();
  }
  const target = h !== page ? document.getElementById(h) : null;
  requestAnimationFrame(() => {
    if (target) target.scrollIntoView({ behavior: changed || reduce ? 'auto' : 'smooth', block: 'start' });
    else if (changed) window.scrollTo(0, 0);
  });
};
addEventListener('hashchange', route);

/* ================= SCROLL EFFECTS ================= */
const prog = $('#progress'), totop = $('#totop');
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  totop.classList.toggle('show', scrollY > 900);
}, { passive: true });
totop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

const countUp = el => {
  const to = parseFloat(el.dataset.countTo), dec = +(el.dataset.dec || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  if (reduce) { el.textContent = pre + fmt(to, dec) + suf; return; }
  const t0 = performance.now(), dur = 1500;
  const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - (1 - k) ** 3; el.textContent = pre + fmt(to * e, dec) + suf; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
const activate = el => {
  el.classList.add('in');
  $$('[data-count-to]', el).concat(el.matches('[data-count-to]') ? [el] : []).forEach(n => { if (!n.dataset.done) { n.dataset.done = 1; countUp(n); } });
  $$('.meter i[data-w], .mbar i[data-w], .bom .bar i[data-w]', el).forEach(i => { i.style.width = i.dataset.w + '%'; });
  $$('.ring .fg', el).forEach(c => { c.style.strokeDashoffset = 201 - 201 * (+c.dataset.w / 25) * .96; });
};
const revealObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { activate(e.target); revealObs.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
const observeReveals = () => {
  const page = $('.page.on');
  if (!page) return;
  $$('.reveal:not(.in)', page).forEach(el => revealObs.observe(el));
  $$('[data-count-to]', page).forEach(el => { if (!el.closest('.reveal')) revealObs.observe(el); });
};
$$('.cta .reveal, footer .reveal').forEach(el => revealObs.observe(el));

/* home steps */
const steps = $$('#steps .step');
let stepI = 0, stepTimer;
const setStep = i => { stepI = i; steps.forEach((s, k) => s.classList.toggle('on', k === i)); };
steps.forEach((s, i) => { s.addEventListener('click', () => { setStep(i); clearInterval(stepTimer); }); s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setStep(i); clearInterval(stepTimer); } }); });
if (!reduce) stepTimer = setInterval(() => setStep((stepI + 1) % steps.length), 3600);

/* cause and consequence pairs */
$$('#cc .pair').forEach(p => {
  const on = () => { $$('#cc .pair').forEach(q => q.classList.remove('hot')); p.classList.add('hot'); };
  $$('.cell', p).forEach(c => { c.addEventListener('mouseenter', on); c.addEventListener('click', on); });
  p.addEventListener('focus', on);
});

/* station hotspots */
const hsSet = i => { $$('#anatomy .hs').forEach(g => g.classList.toggle('on', +g.dataset.h === i)); $$('#hotList button').forEach(b => b.classList.toggle('on', +b.dataset.h === i)); };
$$('#anatomy .hs').forEach(g => g.addEventListener('click', () => hsSet(+g.dataset.h)));
$$('#hotList button').forEach(b => { b.addEventListener('click', () => hsSet(+b.dataset.h)); b.addEventListener('mouseenter', () => hsSet(+b.dataset.h)); });
hsSet(0);

/* tabs */
const tabs = $$('[role=tab]');
const selTab = t => { tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).classList.toggle('on', on); }); };
tabs.forEach((t, i) => { t.addEventListener('click', () => selTab(t)); t.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; selTab(n); n.focus(); } }); });

/* ================= LIVE DEMO: one shared station =================
   The sensor simulator (iframe under "Alert rules") is the single source of truth.
   Page <- simulator state -> 3D station, phone demo, rule cards and log. Buttons send commands back. */
const simF = $('#simFrame'), stF = $('#stationFrame'), log = $('#log');
function loadFrames() { $$('iframe[data-src]').forEach(f => { if (!f.src || f.src === 'about:blank' || !f.getAttribute('src')) f.src = f.dataset.src; }); }
const toSim = m => simF && simF.contentWindow && simF.contentWindow.postMessage({ type: 'sim-cmd', ...m }, '*');
const toStation = m => stF && stF.contentWindow && stF.contentWindow.postMessage(m, '*');
const p2 = n => String(n).padStart(2, '0');
const clockOf = sec => { const t = 2 * 3600 + 14 * 60 + Math.floor(sec); return [Math.floor(t / 3600) % 24, Math.floor(t / 60) % 60, t % 60].map(p2); };
let S = null, prev = null;
const say = (msg, cls = '') => { const c = clockOf(S ? S.sim : 0), line = document.createElement('div'); if (cls) line.className = cls; line.textContent = `${c.join(':')}  ${msg}`; log.appendChild(line); while (log.children.length > 40) log.firstChild.remove(); log.scrollTop = log.scrollHeight; };
const LIVE = { ph: v => v.ph.toFixed(1), do: v => v.do.toFixed(1) + ' mg/L', turb: (v, s) => Math.round(v.turb) + ' NTU · limit ' + Math.round(s.limit), temp: v => v.temp.toFixed(1) + ' °C' };
const onState = s => {
  S = s; const v = s.values, [hh, mm] = clockOf(s.sim);
  $$('.thr .card[data-k]').forEach(c => { const k = c.dataset.k; c.classList.toggle('hit', !!s.bad[k]); const l = $('.live', c); if (l) l.textContent = LIVE[k](v, s); });
  $('#rPh').textContent = v.ph.toFixed(1); $('#rDo').textContent = v.do.toFixed(1); $('#rTu').textContent = Math.round(v.turb); $('#rTe').textContent = v.temp.toFixed(1);
  $('#rPh').classList.toggle('hi', !!s.bad.ph); $('#rDo').classList.toggle('hi', !!s.bad.do); $('#rTu').classList.toggle('hi', !!s.bad.turb);
  $('#clock').textContent = `${hh}:${mm}`;
  const col = s.alert ? '#ff6b57' : s.cnt > 0 ? '#f2a541' : '#4caf50';
  $('#pt').setAttribute('fill', col); $('#ptRing').setAttribute('stroke', col); $('#ptRing').setAttribute('opacity', s.alert ? 1 : 0);
  const pb = $('#ptBadge'); pb.textContent = s.alert ? 'Alert' : s.cnt > 0 ? `Checking ${s.cnt}/3` : 'Normal'; pb.className = 'badge' + (s.alert ? ' bad' : s.cnt > 0 ? ' warn' : '');
  const ab = $('#appBadge'); ab.textContent = s.alert ? '1 alert' : 'All clear'; ab.className = 'badge' + (s.alert ? ' bad' : '');
  $('#appAlert').classList.toggle('show', !!s.alert);
  if (s.alert) $('#alertTime').textContent = `${hh}:${mm}`;
  if (!prev || s.sim < prev.sim - 1) { log.innerHTML = ''; say('Station NH-04 online. Reading every 2 seconds.', 'ok'); }
  else if (s.alert && !prev.alert) say('ALERT sent to the Department dashboard and nearby residents', 'bad');
  else if (s.cnt > prev.cnt && !s.alert) say(`Outside limit (${s.cnt}/3): pH ${v.ph.toFixed(1)}, DO ${v.do.toFixed(1)} mg/L, ${Math.round(v.turb)} NTU`, 'bad');
  else if (s.cnt === 0 && (prev.cnt > 0 || prev.alert)) say(prev.alert ? 'Back within limits: alert cleared' : 'Back within limits: single spike ignored, no alert', 'ok');
  prev = s;
};
addEventListener('message', e => {
  const d = e.data; if (!d || typeof d !== 'object') return;
  if (simF && e.source === simF.contentWindow) {
    if (d.type === 'station-state' && d.values && d.bad) { onState(d); toStation(d); }
    else if (d.type === 'sim-height' && d.h) simF.style.height = Math.ceil(d.h) + 'px';
  } else if (stF && e.source === stF.contentWindow && d.type === 'station-part' && d.part >= 0) hsSet(d.part);
});
$('#btnDischarge').addEventListener('click', () => { toSim({ cmd: 'discharge' }); say('Discharge starts upstream of the probe'); });
$('#btnSpike').addEventListener('click', () => { toSim({ cmd: 'spike' }); say('Debris hits the probe: one odd reading'); });
$('#btnReset').addEventListener('click', () => toSim({ cmd: 'reset' }));
$$('#hotList button').forEach(b => b.addEventListener('click', () => toStation({ type: 'station-focus', part: +b.dataset.h })));
if (log) { log.textContent = 'Waiting for the simulated station… (open the Solution page)'; }

/* ================= RIVER SCENES ================= */
const ping = $('#ping');
let pingT;
const heroState = S => {
  if (!ping) return;
  if (S.alert && !ping.classList.contains('on')) {
    $('#pingTime').textContent = new Date().toTimeString().slice(0, 5);
    ping.classList.add('on'); clearTimeout(pingT); pingT = setTimeout(() => ping.classList.remove('on'), 5200);
  }
};
const scenes = new Map();
const visObs = new IntersectionObserver(es => es.forEach(e => { const s = scenes.get(e.target); if (!s) return; e.isIntersecting && !document.hidden ? s.start() : s.stop(); }));
const ensure = (cv, opts) => { if (!scenes.has(cv)) { scenes.set(cv, new RiverScene(cv, opts)); visObs.observe(cv); } return scenes.get(cv); };
const startCanvases = () => {
  const page = $('.page.on');
  scenes.forEach((s, cv) => { if (cv.closest('.page') && !cv.closest('.page.on')) s.stop(); });
  $$('canvas.stream', page).forEach((cv, i) => ensure(cv, { mode: 'band', seed: 3 + PAGES.indexOf(page.dataset.page) }));
  scenes.forEach((s, cv) => { if (cv.closest('.page.on') || !cv.closest('.page')) { s.resize(); visObs.unobserve(cv); visObs.observe(cv); } });
};
ensure($('#heroCanvas'), { mode: 'hero', seed: 7, onState: heroState });
ensure($('.cta canvas'), { mode: 'band', seed: 21 });
document.addEventListener('visibilitychange', () => scenes.forEach((s, cv) => { if (document.hidden) s.stop(); else if (!cv.closest('.page') || cv.closest('.page.on')) { visObs.unobserve(cv); visObs.observe(cv); } }));

/* ================= WORD COUNT ================= */
const countWords = () => {
  let words = 0;
  $$('[data-count]').forEach(a => {
    const c = a.cloneNode(true);
    $$('.crumbs, .subnav, .phone, .log, .explore, .ping, .pending, svg, .stage-btns, .stage, .simblock, .figcap, iframe', c).forEach(x => x.remove());
    words += (c.textContent.match(/[\p{L}\p{N}][\p{L}\p{N}’'.,%₫$/–-]*/gu) || []).length;
  });
  LIFE.forEach(s => { words += (`${s.k} ${s.imp} ${s.who} ${s.act}`.match(/\S+/g) || []).length; });
  return words;
};
const wc = countWords();
$('#wc').textContent = `Main report length: about ${fmt(wc)} words (limit 4,000)`;
window.__wc = wc;

route();
}
}
