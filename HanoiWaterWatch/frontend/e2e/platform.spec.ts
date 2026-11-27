import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const station = '/stations/HWW-KNG-001';

test.beforeEach(async ({ page }) => {
  // The station directory remains usable without network imagery.
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
});

test('renders the three stations and the simulated-data notice on every public page', async ({ page }) => {
  await page.goto('/overview');
  await expect(page.locator('.station-row')).toHaveCount(3);
  await expect(page.locator('.station-row').filter({ hasText: 'HWW-NHU-001' })).toContainText('Planned station');
  for (const path of ['/map', '/overview', `${station}/dashboard`, `${station}/model`, '/overview/alerts', '/login']) {
    await page.goto(path);
    await expect(page.getByRole('note')).toContainText('All readings on this site');
    await expect(page.locator('main h1')).toBeVisible();
  }
  await page.goto('/simulation');
  await expect(page.getByRole('button', { name: 'Start replay' })).toHaveCount(0);
});

test('keeps sensor selection keyboard-accessible when the 3D asset is unavailable', async ({ page }) => {
  await page.route('**/station-3d/**', route => route.fulfill({ status: 404 }));
  await page.goto(`${station}/model`);
  await page.getByRole('button', { name: '3D model', exact: true }).click();
  const temperature = page.getByRole('button', { name: /Water temperature/i });
  await temperature.focus();
  await temperature.press('Enter');
  await expect(page).toHaveURL(/sensor=temp/);
  await expect(page.locator('.model-aside .reading')).toContainText('—');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const serious = results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(serious.flatMap(violation => violation.nodes.map(node => `${violation.id}: ${node.target.join(' ')}`))).toEqual([]);
});

test('staff review scoped replay evidence in Overview and guests see public history', async ({ page }) => {
  test.setTimeout(180_000);
  const filter = 'station=HWW-KNG-001&category=water_quality';
  await page.goto('/login?returnTo=' + encodeURIComponent('/overview/alerts?' + filter));
  await page.getByLabel('Username').fill(process.env.HWW_E2E_USERNAME!);
  await page.getByLabel('Password', { exact: true }).fill(process.env.HWW_E2E_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(url => url.pathname === '/overview/alerts');
  const headers = { 'X-Requested-With':'hww', Origin:new URL(page.url()).origin };
  const run = await page.request.post('/api/v1/replays/turbidity-spike/runs', {headers,
    data:{station_code:'HWW-KNG-001', speed:5, takeover:true, loop:false}});
  expect(run.ok()).toBeTruthy();
  const session = await run.json();
  const alertLink = page.locator('.alert-directory .alert-row').first();
  await expect(alertLink).toBeVisible({ timeout: 45_000 });
  const detailPath = await alertLink.getAttribute('href');
  expect(detailPath).toContain('/overview/alerts/');
  expect(detailPath).toContain(filter);
  await alertLink.click();
  await expect(page.locator('.evidence-values')).toBeVisible();
  await page.request.post('/api/v1/replay-runs/' + session.session_id + '/stop', {headers,data:{}});
  await page.locator('.back-link').filter({hasText:'Alerts & review'}).click();
  await expect(page).toHaveURL(url => url.pathname + url.search === '/overview/alerts?' + filter);
  await page.goto(detailPath!);
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Acknowledge', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Acknowledge', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Start review', exact: true }).click();
  await expect(page.getByRole('button',{name:'Submit and close'})).toBeVisible();
  // Reopen the same incident in each user's actual session, then return to the owner.
  for (const role of ['OPERATOR', 'ADMIN', 'REVIEWER']) {
    expect((await page.request.post('/api/v1/auth/logout', {headers,data:{}})).ok()).toBeTruthy();
    const prefix = role === 'REVIEWER' ? 'HWW_E2E_' : 'HWW_E2E_' + role + '_';
    const signedIn = await page.request.post('/api/v1/auth/login', {headers, data:{
      username:process.env[prefix + 'USERNAME'], password:process.env[prefix + 'PASSWORD'],
    }});
    expect(signedIn.ok()).toBeTruthy();
    await page.reload();
    await page.getByLabel('Review note').fill('Peer role check');
    const submit = page.getByRole('button',{name:'Submit and close',exact:true});
    if (role === 'OPERATOR') await expect(submit).toBeDisabled();
    else await expect(submit).toBeEnabled();
  }
  await page.getByLabel('Review note').fill('Reviewed the simulated replay in browser QA.');
  await page.getByRole('button', { name: 'Submit and close', exact: true }).click();
  await expect(page.getByText('alert closed', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Account' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await page.goto(detailPath!);
  await expect(page.getByRole('link', { name: 'Sign in for staff actions' })).toBeVisible();
  await expect(page.getByText('Reviewed the simulated replay in browser QA.')).toHaveCount(0);
});
