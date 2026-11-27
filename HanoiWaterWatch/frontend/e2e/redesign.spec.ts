import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const station = 'HWW-TLH-001';
const nav = (page: Page) => page.getByRole('navigation', { name: 'Workspace navigation', exact: true });
const password = (page: Page) => page.getByLabel('Password', { exact: true });
const viewports = [
  [320, 640], [360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [844, 390],
];
const pages = ['/login', '/map', '/overview', `/stations/${station}/model`, `/stations/${station}/dashboard`, '/overview/alerts'];

test.beforeEach(async ({ page }) => {
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
});

test('public entry validates staff credentials and lands on the map', async ({ page }) => {
  await page.goto('/');
  const submit = page.getByRole('button', { name: 'Sign in', exact: true });
  await submit.click();
  await expect(page.getByLabel('Username')).toBeFocused();
  await page.getByLabel('Username').fill(process.env.HWW_E2E_USERNAME!);
  await password(page).fill('incorrect-for-this-temporary-account');
  await submit.click();
  await expect(page.getByRole('alert')).toBeVisible();
  await password(page).fill(process.env.HWW_E2E_PASSWORD!);
  await submit.click();
  await expect(page).toHaveURL(/\/map(?:\?|$)/);
  await expect(page.locator('.leaflet-container')).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Account' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByLabel('Username')).toBeVisible();
});

test('one dock supports keyboard navigation and legacy URLs preserve context', async ({ page }) => {
  await page.goto('/map');
  const dock = nav(page);
  await expect(dock.getByRole('link')).toHaveCount(4);
  await expect(page.locator('.workspace-brand')).toHaveText('HanoiWaterWatch');
  await expect(page.locator('.brand-group :is(button,a)')).toHaveCount(0);
  await dock.getByRole('link', { name: 'Overview' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/overview$/);
  await expect(dock.locator('[aria-current="page"]')).toHaveText('Overview');
  await page.goBack();
  await expect(page.locator('.leaflet-container')).toBeVisible();
  for (const [old, current] of [
    ['/simulation?station=' + station, '/map?station=' + station],
    ['/stations?station=' + station, '/map?station=' + station],
    ['/stations/' + station + '?range=6', '/stations/' + station + '/dashboard?range=6'],
    ['/alerts?severity=critical', '/overview/alerts?severity=critical'],
    ['/alerts/17?station=' + station, '/overview/alerts/17?station=' + station],
  ]) {
    await page.goto(old);
    await expect(page).toHaveURL(url => url.pathname + url.search === current);
  }
  await expect(dock.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button',{name:'Account'}).click();
  await page.getByRole('button',{name:'Tiếng Việt'}).click();
  await expect(page.locator('.dock-destinations a[aria-current="page"]')).toHaveAccessibleName('Tổng quan');
});

test('station result selects the map and preserves station context through the dashboard', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/overview');
  await page.getByRole('link', { name: 'Search stations' }).click();
  const search = page.getByRole('searchbox', { name: 'Search stations or rivers' });
  await expect(search).toBeFocused({ timeout: 15000 });
  await search.fill('no-station-matches-this');
  await expect(page.getByRole('button', { name: new RegExp(station) })).toHaveCount(0);
  await search.fill(station);
  await page.getByRole('region', { name: 'Station list' }).getByRole('button', { name: new RegExp(station) }).press('Enter');
  await expect(page).toHaveURL(new RegExp('station=' + station));
  const details = page.getByRole('complementary', { name: 'Station details' });
  await expect(details).toContainText(station);
  await details.getByRole('link', { name: 'Dashboard' }).click();
  await expect(page).toHaveURL(new RegExp('/stations/' + station + '/dashboard'));
  await page.goBack();
  await expect(details).toContainText(station);
  await expect(page.getByRole('link', { name: /OpenStreetMap/ })).toBeVisible();
});

test('mobile station sheet expands and dismisses with explicit controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?station=' + station);
  const details = page.getByRole('complementary', { name: 'Station details' });
  await expect(details).toContainText(station);
  await page.getByRole('button', { name: 'Expand details' }).click();
  await expect(details.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('button', { name: 'Close station details' }).click();
  await expect(details).toHaveCount(0);
  await expect(page).not.toHaveURL(/station=/);
});

test('workspace and sign-in fit the designated viewports, including landscape', async ({ page }) => {
  test.setTimeout(180_000);
  for (const path of pages) {
    await page.goto(path);
    await expect(page.locator('main h1')).toBeAttached();
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      if (path !== '/login') {
        await expect(nav(page)).toBeInViewport({ ratio: 1 });
        const box = (await page.locator('.dest-dock').boundingBox())!;
        expect(Math.abs(height - box.y - box.height)).toBeLessThan(1);
        await expect(nav(page).getByRole('link')).toHaveCount(4);
      }
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        { message: `${path} overflows ${width} × ${height}` }).toBeLessThanOrEqual(1);
    }
  }
});

test('reduced motion and compact visual viewport keep sign-in usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 430 });
  await page.goto('/login');
  await password(page).focus();
  await expect(password(page)).toBeFocused();
  await page.getByRole('button', { name: 'Sign in', exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeInViewport();
  expect(await page.locator('video').evaluateAll(videos => videos.every(video => video.paused))).toBe(true);
});

test('password visibility preserves the value and a failed network request allows retry', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('browser-test-account');
  await password(page).fill('browser-test-password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(password(page)).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(password(page)).toHaveAttribute('type', 'password');
  await expect(password(page)).toHaveValue('browser-test-password');
  await page.route('**/api/v1/auth/login', route => route.abort('connectionfailed'));
  const submit = page.getByRole('button', { name: 'Sign in', exact: true });
  await submit.click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(submit).toBeEnabled();
  await expect(page).toHaveURL(/\/login/);
});

test('a failed station registry request can be retried, with no invented markers', async ({ page }) => {
  let offline = true;
  await page.route('**/api/v1/stations', route => offline ? route.abort('connectionfailed') : route.continue());
  await page.goto('/map');
  const message = page.getByRole('status').filter({ hasText: /Connection interrupted/ });
  await expect(message).toBeVisible();
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(0);
  offline = false;
  await message.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible();
});

test('login and station inspector expose no serious automated accessibility findings', async ({ page }) => {
  test.setTimeout(90_000);
  for (const path of ['/login', '/map?station=' + station]) {
    await page.goto(path);
    if (path.startsWith('/map')) await expect(page.getByRole('complementary', { name: 'Station details' })).toContainText(station);
    else await expect(password(page)).toBeVisible();
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(audit.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
      .flatMap(v => v.nodes.map(n => `${path} ${v.id} ${n.target.join(' ')}`))).toEqual([]);
  }
});

test('the underwater cursor shows soap and bubbles outside the sign-in card', async ({ page }) => {
  await page.route('**/underwater.mp4', route => route.abort());
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  const entry = page.locator('.entry-page');
  await expect(entry).toBeVisible();
  expect(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(true);
  let x = 220;
  await expect.poll(async () => {
    await page.mouse.move(x++, 300);
    return entry.getAttribute('data-pointer');
  }).toBe('active');
  const pointer = page.locator('.entry-pointer');
  await expect(pointer).toBeVisible();
  await expect(pointer).toHaveText('🧼');
  await expect(entry).toHaveCSS('cursor', 'none', { timeout: 2000 });
  await page.mouse.down();
  await expect(pointer).toHaveText('🫧');
  await page.mouse.up();
  await expect(pointer).toHaveText('🧼');
  const card = page.locator('.entry-card');
  await card.hover({ position: { x: 10, y: 10 } });
  await expect(card).not.toHaveCSS('cursor', 'none', { timeout: 2000 });
  await expect(pointer).toBeHidden();
  const username = page.getByLabel('Username');
  await username.click();
  await expect(username).not.toHaveCSS('cursor', 'none');
  await expect(username).toBeFocused();
  await page.mouse.move(300, 360);
  await expect(pointer).toBeVisible();
  await expect(pointer).toHaveText('🧼');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(300, 360);
  await expect(entry).not.toHaveAttribute('data-pointer', 'active');
  await expect(entry).not.toHaveCSS('cursor', 'none');
  await expect(pointer).toBeHidden();
});

test.describe('touch map', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test('filters registry stations and toggles map layers by touch', async ({ page }) => {
    await page.goto('/map');
    await expect(page.locator('.station-pin')).toHaveCount(3);
    const tools = page.getByRole('button', { name: 'Map tools', exact: true });
    await tools.tap();
    await page.getByRole('button', { name: 'Filters', exact: true }).tap();
    await page.getByRole('combobox', { name: 'River', exact: true }).selectOption({ label: 'Tô Lịch' });
    await expect(page.locator('.station-pin')).toHaveCount(1);
    await page.getByRole('button', { name: 'Reset filters' }).tap();
    await expect(page.locator('.station-pin')).toHaveCount(3);
    await page.getByRole('button', { name: 'Back to map tools' }).tap();
    await page.getByRole('button', { name: 'Layers', exact: true }).tap();
    await page.getByRole('checkbox', { name: 'Station markers' }).tap();
    await expect(page.locator('.station-pin')).toHaveCount(0);
    await page.getByRole('checkbox', { name: 'Station markers' }).tap();
    await expect(page.locator('.station-pin')).toHaveCount(3);
  });
});

test('a disconnected dashboard marks its cached station snapshot stale', async ({ page, context }) => {
  await page.goto('/stations/' + station + '/dashboard');
  await expect(page.locator('.sensor-card')).toHaveCount(4);
  await context.setOffline(true);
  await expect(page.locator('.sensor-card.stale-state')).toHaveCount(4);
  await expect(page.locator('.sensor-card .reading').first()).toContainText('—');
});

test('map controls align in two evenly spaced stacks above the footer', async ({ page }) => {
  await page.goto('/map', { waitUntil: 'domcontentloaded' });
  const search = page.getByRole('button', { name: 'Search stations', exact: true });
  const tools = page.getByRole('button', { name: 'Map tools', exact: true });
  const zoomIn = page.getByRole('button', { name: 'Zoom in', exact: true });
  const zoomOut = page.getByRole('button', { name: 'Zoom out', exact: true });
  const navigation = page.getByRole('navigation', { name: 'Workspace navigation', exact: true });
  const attribution = page.locator('.leaflet-control-attribution');

  for (const [width, height] of [[320, 640], [360, 740], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    const items = [page.locator('.dest-dock'), attribution, search, tools, zoomIn, zoomOut];
    await Promise.all(items.map(item => expect(item).toBeInViewport({ ratio: 1 })));
    const [dock, credit, left, tool, plus, minus] = await Promise.all(items.map(item => item.boundingBox()));
    for (const box of [dock!, credit!]) {
      expect(Math.abs(height - (box.y + box.height))).toBeLessThan(1);
    }
    expect(dock!.x + dock!.width).toBeLessThan(credit!.x);
    expect(left!.x).toBeLessThan(30);
    expect(left!.x + left!.width).toBeLessThan(dock!.x);
    expect(tool!.x).toBe(left!.x);
    expect(width - (minus!.x + minus!.width)).toBeLessThan(30);
    expect(plus!.x).toBe(minus!.x);
    const zoomGap = minus!.y - (plus!.y + plus!.height);
    const toolsGap = left!.y - (tool!.y + tool!.height);
    expect(zoomGap).toBeGreaterThan(0);
    expect(Math.abs(toolsGap - zoomGap)).toBeLessThan(1);
    expect(Math.abs(tool!.y - plus!.y)).toBeLessThan(1);
    expect(Math.abs(left!.y - minus!.y)).toBeLessThan(1);
    expect(minus!.y + minus!.height).toBeLessThan(credit!.y);
    const links = navigation.getByRole('link');
    await expect(links).toHaveCount(4);
    await Promise.all((await links.all()).map(async link => {
      await expect(link).toBeInViewport({ ratio: 1 });
      expect((await link.boundingBox())!.width).toBeGreaterThanOrEqual(24);
    }));

    await search.click();
    const list = page.getByRole('region', { name: 'Station list' });
    await expect(list).toBeInViewport();
    const box = (await list.boundingBox())!;
    expect(box.y + box.height).toBeLessThan(left!.y);
    await page.keyboard.press('Escape');
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map?station=' + station, { waitUntil: 'domcontentloaded' });
  const details = page.getByRole('complementary', { name: 'Station details' });
  const list = page.getByRole('region', { name: 'Station list' });
  await expect(details).toBeVisible();
  await search.click();
  await expect(list).toBeVisible();
  const [mobileList, mobileDetails, searchBox, minusBox] = await Promise.all(
    [list, details, search, zoomOut].map(item => item.boundingBox()));
  expect(mobileList!.y + mobileList!.height).toBeLessThan(mobileDetails!.y);
  expect(Math.abs(searchBox!.y - minusBox!.y)).toBeLessThan(1);
  expect(searchBox!.y + searchBox!.height).toBeLessThan(mobileDetails!.y);

  await page.setViewportSize({ width: 1024, height: 768 });
  const [desktopList, desktopDetails] = await Promise.all([list.boundingBox(), details.boundingBox()]);
  expect(desktopList!.x + desktopList!.width).toBeLessThan(desktopDetails!.x);
});

test('map fills the viewport behind independent floating controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map');
  const canvas = page.locator('.leaflet-container');
  await expect(canvas).toBeVisible();
  await expect.poll(async () => (await canvas.boundingBox())?.height).toBe(844);
  const logo = await page.locator('.workspace-brand').boundingBox();
  expect(Math.abs(logo!.x + logo!.width / 2 - 195)).toBeLessThan(1);
  const tools = page.getByRole('button', { name: 'Map tools', exact: true });
  await expect(tools).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Layers', exact: true })).toHaveCount(0);
  await tools.press('Enter');
  const zoom = page.getByRole('button', { name: 'Zoom in', exact: true });
  const scale = page.locator('.leaflet-control-scale-line');
  const initialScale = await scale.textContent();
  await zoom.click();
  await expect(scale).not.toHaveText(initialScale!);
  await tools.click();
  await page.getByRole('button', { name: 'Fit stations', exact: true }).click();
  await expect(scale).toHaveText(initialScale!);
  await page.keyboard.press('Escape');
  await expect(tools).toBeFocused();
  await expect(nav(page)).toBeVisible();
  await page.getByRole('button', { name: 'Notifications', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Notifications' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();
});

test('floating lists stay inside a short viewport and honor reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 360 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/map?station=' + station);
  const dock = nav(page);
  await expect(dock).toBeInViewport({ratio:1});
  const link = dock.getByRole('link', {name:'Dashboard'});
  await link.focus();
  await expect(link).toBeInViewport();
  expect(await link.evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');

  await page.getByRole('button', { name: 'Expand details' }).click();
  const tools = page.getByRole('button', { name: 'Map tools', exact: true });
  const sheet = page.getByRole('complementary', { name: 'Station details' });
  const [toolsBox, sheetBox] = await Promise.all([tools.boundingBox(), sheet.boundingBox()]);
  expect(toolsBox!.y + toolsBox!.height).toBeLessThan(sheetBox!.y);
  await tools.click();
  const options = page.locator('#map-tool-choices');
  await expect(options).toBeInViewport({ ratio: 1 });
  const optionsBox = (await options.boundingBox())!;
  expect(optionsBox.y + optionsBox.height).toBeLessThan(sheetBox!.y);
  expect(await options.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
});

test('search expands from its floating trigger and keeps the selected row', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/map');
  const search = page.getByRole('button',{name:'Search stations',exact:true});
  await expect(search).toHaveAttribute('aria-expanded','false');
  await search.click();
  const input = page.getByRole('searchbox',{name:'Search stations or rivers'});
  await expect(input).toBeFocused();
  await input.fill('To Lich');
  await page.getByRole('region',{name:'Station list'}).getByRole('button',{name:/HWW-TLH-001/}).click();
  await expect(search).toHaveAttribute('aria-expanded','false');
  await expect(page.getByRole('complementary',{name:'Station details'})).toContainText('HWW-TLH-001');
  await search.click();
  await expect(page.getByRole('region',{name:'Station list'}).getByRole('button',{name:/HWW-TLH-001/})).toHaveAttribute('aria-pressed','true');
});

test('dashboard comparison requests the same channel and period for both stations', async ({page}) => {
  await page.goto('/stations/HWW-KNG-001/dashboard?range=24&sensor=ph');
  const preceding: URL[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.pathname.endsWith('/measurements')) preceding.push(url);
  });
  await page.getByLabel('Compare station').selectOption('HWW-TLH-001');
  await page.getByRole('combobox',{name:'Time range',exact:true}).selectOption('168');
  await expect(page).toHaveURL(url => url.searchParams.get('range') === '168' &&
    url.searchParams.get('compare') === 'HWW-TLH-001');
  await expect.poll(() => preceding.some(a =>
    a.pathname.includes('KNG') && a.searchParams.get('channel') === 'ph' && preceding.some(b =>
      b.pathname.includes('TLH') && a.search === b.search && Date.parse(a.searchParams.get('to')!) - Date.parse(a.searchParams.get('from')!) === 7 * 86400000)
  )).toBe(true);
});
