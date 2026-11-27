import { expect, test } from '@playwright/test';

test.skip(process.env.HWW_E2E_DEMO !== '1', 'Run against the explicitly built local demo.');

test('the demo links shared records and keeps monitoring actions off the wire', async ({page}) => {
  test.setTimeout(90000);
  const monitoringRequests: string[] = [];
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith('/api/v1/') && !path.startsWith('/api/v1/auth/')) monitoringRequests.push(path);
  });

  await page.goto('/login?returnTo=%2Fmap');
  await page.getByLabel('Username').fill(process.env.HWW_E2E_USERNAME!);
  await page.getByLabel('Password', {exact:true}).fill(process.env.HWW_E2E_PASSWORD!);
  await page.getByRole('button', {name:'Sign in',exact:true}).click();
  await expect(page.getByText('DEMO MODE · Synthetic data')).toBeVisible();
  await page.getByRole('button', {name:'Search stations',exact:true}).click();
  await page.getByRole('searchbox').fill('HWW-DEMO-04');
  await page.getByRole('region',{name:'Station list'}).getByRole('button',{name:/HWW-DEMO-04/}).click();
  const station = page.getByRole('complementary',{name:'Station details'});
  await expect(station).toContainText('HWW-DEMO-04');
  await station.getByRole('link',{name:'Dashboard'}).click();
  await expect(page.getByRole('heading',{level:1})).toContainText('demonstration station 2');
  await page.getByLabel('Compare station').selectOption('HWW-KNG-001');
  await page.getByRole('combobox',{name:'Sensor',exact:true}).selectOption('turbidity');
  await expect(page.getByRole('button', {name:'HWW-KNG-001',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button', {name:'HWW-KNG-001',exact:true}).click();
  await expect(page.getByRole('button', {name:'HWW-KNG-001',exact:true})).toHaveAttribute('aria-pressed','false');
  await page.getByRole('button',{name:'Data table',exact:true}).click();
  await expect(page.getByRole('table')).toContainText('HWW-DEMO-04');

  await page.getByRole('button',{name:'Notifications',exact:true}).click();
  const notifications = page.getByRole('region',{name:'Notifications'});
  await expect(notifications.getByRole('link',{name:'View all alerts'})).toBeVisible();
  await expect(notifications.getByRole('link',{name:/pH above the reference band/})).toHaveCount(0);
  await notifications.getByRole('link',{name:'View all alerts'}).click();
  await page.getByRole('link',{name:/pH above the reference band/}).first().click();
  await expect(page.getByRole('heading',{name:'pH above the reference band'})).toBeVisible();
  await page.getByRole('button',{name:'Start review',exact:true}).click();
  await page.getByLabel('Review note').fill('Verified local-only synthetic review.');
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button',{name:'Submit and close',exact:true}).click();
  await expect(page.getByText('alert closed',{exact:true})).toBeVisible();

  await page.goto('/overview');
  await expect(page.locator('.station-row')).toHaveCount(5);
  await page.getByRole('button',{name:'Account',exact:true}).click();
  await expect(page.getByRole('heading',{name:/Demo workspace profile/})).toBeVisible();
  await page.goto('/stations/HWW-TLH-001/model?sensor=ph');
  await expect(page.locator('.model-aside .reading')).toContainText('9.70');

  await page.goto('/simulation?station=HWW-TLH-001');
  await expect(page).toHaveURL(/\/map\?station=HWW-TLH-001$/);
  await expect(page.getByRole('complementary',{name:'Station details'})).toContainText('HWW-TLH-001');
  expect(monitoringRequests).toEqual([]);
});

test('demo administration previews analytics and delivers announcements locally', async ({page}) => {
  const monitoringRequests: string[] = [];
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith('/api/v1/') && !path.startsWith('/api/v1/auth/')) monitoringRequests.push(path);
  });
  await page.goto('/admin');
  await page.getByLabel('Username').fill(process.env.HWW_E2E_ADMIN_USERNAME!);
  await page.getByLabel('Password', {exact:true}).fill(process.env.HWW_E2E_ADMIN_PASSWORD!);
  await page.getByRole('button', {name:'Sign in', exact:true}).click();
  await expect(page.getByRole('heading', {name:'Administration'})).toBeVisible();
  await expect(page.getByRole('heading', {name:'Monitoring statistics'})).toBeVisible();
  await expect(page.getByText('Valid / received samples').first()).toBeVisible();
  const message = 'Synthetic monitoring demonstration';
  await page.getByLabel('Message', {exact:true}).fill(message);
  await page.getByRole('button', {name:'Review announcement'}).click();
  await expect(page.getByRole('region', {name:'Confirm action'})).toContainText(message);
  await page.getByRole('button', {name:'Confirm', exact:true}).click();
  await expect(page.getByText('Authorized recipients: 1')).toBeVisible();
  await page.getByRole('button', {name:'Notifications', exact:true}).click();
  await expect(page.getByRole('region', {name:'Notifications'})).toContainText(message);
  expect(monitoringRequests).toEqual([]);
});
