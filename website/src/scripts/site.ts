// @ts-nocheck  (ported from the design prototype; typed loosely on purpose)
import { CRIT, OPTS, BUILD, PH_KIT, LIFE, TEAM } from '../content/data';
import { MapScene } from '../scenes/mapScene';
import { RiverScene } from '../scenes/riverScene';

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

/* ================= RENDER ================= */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => n.split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('');

$('#critGrid').innerHTML = CRIT.map((c, i) => `
  <div class="card lift reveal d${i % 3}">
    <div class="ring"><svg viewBox="0 0 76 76" aria-hidden="true"><circle class="bgc" cx="38" cy="38" r="32"/><circle class="fg" cx="38" cy="38" r="32" stroke-dasharray="201" stroke-dashoffset="201" data-w="${c.w}"/></svg><b>${c.w}%</b></div>
    <div><h3>${esc(c.k)}</h3><p>${esc(c.d)}</p><p class="why">Why: ${esc(c.why)}</p></div>
  </div>`).join('');

/* decision matrix */
const total = o => o.s.reduce((a, v, i) => a + v * CRIT[i].w, 0) / 5;
$('#legend').innerHTML = CRIT.map(c => `<span><i style="background:${c.c}"></i>${esc(c.k)} ${c.w}%</span>`).join('');
$('#matrix').innerHTML = OPTS.map((o, oi) => `
  <div class="mrow ${oi === 0 ? 'win' : ''}">
    <div class="nm">${esc(o.k)}<small>${oi === 0 ? 'Selected' : 'Not selected'}</small></div>
    <div class="mbar" role="img" aria-label="${esc(o.k)}: ${total(o)} out of 100">${o.s.map((v, i) => `<i style="background:${CRIT[i].c}" data-w="${v * CRIT[i].w / 5}" title="${esc(CRIT[i].k)}: ${v}/5"></i>`).join('')}</div>
    <div class="tot">${total(o)}</div>
  </div>`).join('');
const pick = $('#pick');
pick.innerHTML = OPTS.map((o, i) => `<button type="button" aria-pressed="${i === 0}" data-o="${i}">${esc(o.k)}</button>`).join('');
const showScores = i => {
  $$('button', pick).forEach(b => b.setAttribute('aria-pressed', b.dataset.o == i));
  $('#scoreDetail').innerHTML = OPTS[i].s.map((v, k) => `<div><b>${esc(CRIT[k].k)}</b><span>${v} / 5</span><em>${esc(OPTS[i].r[k])}</em></div>`).join('');
};
pick.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showScores(+b.dataset.o); });
showScores(0);

/* cost analysis: parts list and the totals derived from it */
const dong = v => '₫' + fmt(v);
const station = BUILD.reduce((a, x) => a + x.p, 0), dearest = Math.max(...BUILD.map(x => x.p));
$('#bomBuild').innerHTML = BUILD.map(x => `
  <div class="it"><div><b>${esc(x.n)}</b><small>${esc(x.s)}</small></div><div class="bar"><i data-w="${(x.p / dearest * 100).toFixed(1)}"></i></div><span class="p">${dong(x.p)}</span></div>`).join('') + `<div class="tot"><span>Listed subtotal per station</span><span>${dong(station)}</span></div>`;
const COSTS = { first: station, rest: 2 * station, spare: PH_KIT.p, total: 3 * station + PH_KIT.p };
$$('[data-cost]').forEach(el => { el.textContent = dong(COSTS[el.dataset.cost]); });

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
const PAGES = ['home', 'design', 'solution', 'implementation', 'team', 'references', 'appendices'];
const GROUP = { home: 'home', design: 'design', solution: 'solution', implementation: 'implementation', team: 'team', references: 'resources', appendices: 'resources' };
const menu = $('#menu'), burger = $('#burger');
const closeDrops = except => $$('.menu > li.open').forEach(li => { if (li !== except) { li.classList.remove('open'); const t = $('.top', li); t && t.setAttribute('aria-expanded', 'false'); } });
const desktop = () => matchMedia('(min-width: 981px)').matches;
$$('.menu > li').forEach(li => {
  const top = $('.top', li), drop = $('.drop', li);
  if (!drop) return;
  let timer;
  top.addEventListener('click', e => { e.preventDefault(); const hovering = e.detail > 0 && desktop() && matchMedia('(hover: hover)').matches; const open = hovering || !li.classList.contains('open'); closeDrops(li); li.classList.toggle('open', open); top.setAttribute('aria-expanded', open); });
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
  // #solution-live is a hidden view of the Solution page: only the phone and the 3D station
  const live = h === 'solution-live', wasLive = document.body.classList.contains('livedemo');
  document.body.classList.toggle('livedemo', live);
  $('#p-solution').classList.toggle('livedemo', live);
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
  if (live) document.title = 'Demo · Hanoi WaterWatch';
  else if (wasLive) document.title = `${page[0].toUpperCase() + page.slice(1)} · Hanoi WaterWatch`;
  const target = !live && h !== page ? document.getElementById(h) : null;
  requestAnimationFrame(() => {
    if (target) target.scrollIntoView({ behavior: changed || wasLive || reduce ? 'instant' : 'smooth', block: 'start' });
    else if (changed || live) window.scrollTo({ top: 0, behavior: 'instant' });
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
$$('[data-proxy]').forEach(b => b.addEventListener('click', () => $('#' + b.dataset.proxy).click()));
$$('#hotList button').forEach(b => b.addEventListener('click', () => toStation({ type: 'station-focus', part: +b.dataset.h })));
if (log) { log.textContent = 'Waiting for the simulated station… (open the Solution page)'; }

/* ================= RIVER SCENES ================= */
const scenes = new Map();
const visObs = new IntersectionObserver(es => es.forEach(e => { const s = scenes.get(e.target); if (!s) return; e.isIntersecting && !document.hidden ? s.start() : s.stop(); }));
const ensure = (cv, opts) => { if (!scenes.has(cv)) { scenes.set(cv, new RiverScene(cv, opts)); visObs.observe(cv); } return scenes.get(cv); };
const startCanvases = () => {
  const page = $('.page.on');
  scenes.forEach((s, cv) => { if (cv.closest('.page') && !cv.closest('.page.on')) s.stop(); });
  $$('canvas.stream', page).forEach((cv, i) => ensure(cv, { mode: 'band', seed: 3 + PAGES.indexOf(page.dataset.page) }));
  scenes.forEach((s, cv) => { if (cv.closest('.page.on') || !cv.closest('.page')) { s.resize(); visObs.unobserve(cv); visObs.observe(cv); } });
};
const heroCanvas = $('#heroCanvas');
scenes.set(heroCanvas, new MapScene(heroCanvas));
visObs.observe(heroCanvas);
ensure($('.cta canvas'), { mode: 'band', seed: 21 });
document.addEventListener('visibilitychange', () => scenes.forEach((s, cv) => { if (document.hidden) s.stop(); else if (!cv.closest('.page') || cv.closest('.page.on')) { visObs.unobserve(cv); visObs.observe(cv); } }));

/* ================= WORD COUNT ================= */
const countWords = () => {
  let words = 0;
  $$('[data-count]').forEach(a => {
    const c = a.cloneNode(true);
    $$('.crumbs, .subnav, .phone, .log, .explore, .demo-bar, .pending, svg, .stage-btns, .stage, .simblock, .figcap, iframe', c).forEach(x => x.remove());
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
