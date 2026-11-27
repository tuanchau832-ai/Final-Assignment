/**
 * Reading and interaction helpers layered on top of site.ts: skip link, theme switch, section bar,
 * live demo status, reference search and figure zoom.
 * Everything here is created outside the counted report text, so the word count is unaffected.
 * Call initUx() once, after initSite().
 */

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html) node.innerHTML = html;
  return node;
}

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const activePage = () => $('.page.on');
const isLiveView = () => document.body.classList.contains('livedemo');

/* ---------- skip link (the router owns the hash, so move focus by hand) ---------- */
function initSkipLink() {
  $('#skip')?.addEventListener('click', e => {
    e.preventDefault();
    const page = activePage();
    const target = (page && $('.phead + section, .hero + section', page)) || $('#main');
    if (!target) return;
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'instant' });
  });
}

/* ---------- light / dark switch ---------- */
function initTheme() {
  const btn = $<HTMLButtonElement>('#themeBtn');
  if (!btn) return;
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : system.matches);
  const paint = () => {
    const label = isDark() ? 'Switch to light theme' : 'Switch to dark theme';
    btn.dataset.mode = isDark() ? 'dark' : 'light';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  };
  btn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch { /* private mode: keep for this visit only */ }
    paint();
  });
  system.addEventListener('change', paint);
  paint();
}

/* ---------- sticky "on this page" bar, built from each page's .subnav ---------- */
function initSectionBar() {
  const bar = el('nav', 'secbar');
  bar.setAttribute('aria-label', 'Sections of this page');
  const track = el('div', 'secbar-track');
  bar.append(track);
  document.body.append(bar);
  let builtFor: HTMLElement | null = null;
  let current = '';

  return () => {
    const page = activePage();
    if (page !== builtFor) {
      builtFor = page;
      current = '';
      track.replaceChildren(...(page ? $$<HTMLAnchorElement>('.subnav a', page) : []).map(a => a.cloneNode(true)));
      track.scrollLeft = 0;
    }
    const links = $$<HTMLAnchorElement>('a', track);
    const head = page && $('.phead', page);
    const show = !!links.length && !!head && !isLiveView() && head.getBoundingClientRect().bottom <= 80;
    bar.classList.toggle('show', show);
    if (!show) return;

    // the current section is the last one whose top has passed the bar
    let next = '';
    for (const a of links) {
      const section = document.getElementById(a.hash.slice(1));
      if (section && section.getBoundingClientRect().top <= 220) next = a.hash;
    }
    if (next === current) return;
    current = next;
    for (const a of links) {
      const on = a.hash === next;
      if (on) {
        a.setAttribute('aria-current', 'location');
        track.scrollTo({ left: a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2, behavior: reduce() ? 'auto' : 'smooth' });
      } else a.removeAttribute('aria-current');
    }
  };
}

/* clicking a link to the section already in the address bar does not fire hashchange: scroll anyway */
function initSameHashLinks() {
  document.addEventListener('click', e => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.id === 'skip' || a.hash !== location.hash || !a.hash.includes('-')) return;
    document.getElementById(a.hash.slice(1))?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  });
}

/* ---------- live demo: status readout and button states ---------- */
interface StationState { type: string; alert: boolean; cnt: number }

function initStation() {
  const dots = '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>';
  const status = el('div', 'status wait', `<span class="lamp" aria-hidden="true"></span><div><b role="status">Connecting to the station…</b><small>Over limit in a row: <span class="n">0</span> of 3</small></div>${dots}`);
  $('.ctrl .row')?.before(status);

  const buttons = () => $$<HTMLButtonElement>('#btnDischarge,#btnSpike,#btnReset,[data-proxy]');
  buttons().forEach(b => { b.disabled = true; });

  let ready = false;
  let last = '';
  addEventListener('message', e => {
    const frame = $<HTMLIFrameElement>('#simFrame');
    const d = e.data as StationState | null;
    if (!frame || e.source !== frame.contentWindow || d?.type !== 'station-state') return;
    if (!ready) { ready = true; buttons().forEach(b => { b.disabled = false; }); }
    const streak = Math.max(0, Math.min(3, d.cnt));
    const state = d.alert ? 'bad' : streak ? 'warn' : 'ok';
    const key = state + streak;
    if (key === last) return; // only touch the DOM when something changed, so screen readers are not flooded
    last = key;
    const text = d.alert ? 'Alert sent' : streak ? `Checking ${streak} of 3` : 'Water normal';
    status.classList.remove('wait', 'ok', 'warn', 'bad');
    status.classList.add(state);
    $('b', status)!.textContent = text;
    $$('.dots i', status).forEach((dot, i) => dot.classList.toggle('on', d.alert || i < streak));
    $('.n', status)!.textContent = String(d.alert ? 3 : streak);
  });
}

/* ---------- references: clickable links and a filter ---------- */
function initReferences() {
  const list = $('#p-references .refs');
  if (!list) return;
  const items = $$('p', list);

  for (const p of items) {
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    for (const node of nodes) {
      const parts = node.data.split(/(https?:\/\/\S*[^\s.,;)])/);
      if (parts.length < 2) continue;
      node.replaceWith(...parts.map((part, i) => {
        if (i % 2 === 0) return part;
        const a = el('a');
        a.href = a.textContent = part;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        return a;
      }));
    }
  }

  const tools = el('div', 'reftools', `<input type="search" placeholder="Search by author, year or title" aria-label="Search references"><span role="status">${items.length} sources</span>`);
  const empty = el('p', 'refempty', 'No source matches that search.');
  empty.hidden = true;
  list.prepend(tools);
  list.append(empty);
  // ignore case and Vietnamese accents, so "dai doan" finds "Đại Đoàn"
  const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/gi, 'd').toLowerCase();
  const text = items.map(p => fold(p.textContent || ''));
  $<HTMLInputElement>('input', tools)!.addEventListener('input', e => {
    const words = fold((e.target as HTMLInputElement).value).split(/\s+/).filter(Boolean);
    let n = 0;
    items.forEach((p, i) => { p.hidden = !words.every(w => text[i].includes(w)); if (!p.hidden) n++; });
    $('span', tools)!.textContent = words.length ? `${n} of ${items.length} sources` : `${items.length} sources`;
    empty.hidden = n > 0;
  });
}

/* ---------- click a figure to enlarge it ---------- */
function initZoom() {
  if (!('showModal' in HTMLDialogElement.prototype)) return;
  const dialog = el('dialog', 'zoom', '<button type="button" aria-label="Close enlarged figure">✕</button><img alt="">');
  document.body.append(dialog);
  const big = $<HTMLImageElement>('img', dialog)!;
  dialog.addEventListener('click', () => dialog.close()); // image, button or backdrop
  dialog.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
  $$<HTMLImageElement>('.figframe img').forEach(img => {
    const open = el('button', 'zoomable');
    open.type = 'button';
    open.setAttribute('aria-label', 'Enlarge figure');
    img.replaceWith(open);
    open.append(img);
    open.addEventListener('click', () => {
      big.src = img.src;
      big.alt = img.alt;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
  });
}

let started = false;
export function initUx(): void {
  if (started) return;
  started = true;

  initSkipLink();
  initTheme();
  initSameHashLinks();
  initReferences();
  initZoom();
  const updateBar = initSectionBar();
  initStation();

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; updateBar(); });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  let shown = activePage();
  addEventListener('hashchange', () => {
    // runs after the router in site.ts, which was registered first
    const page = activePage();
    if (page !== shown) {
      shown = page;
      // tell keyboard and screen-reader users that a new page opened
      const h1 = page && $('h1', page);
      if (h1 && location.hash.slice(1) === page.dataset.page) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    }
    onScroll();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isLiveView() && !document.querySelector('dialog[open]')) location.hash = 'solution-demo';
  });
  // leaving the phone layout with the menu open would otherwise keep the page scroll locked
  matchMedia('(min-width: 981px)').addEventListener('change', e => { if (e.matches && $('#menu.open')) $('#burger')?.click(); });

  onScroll();
}
