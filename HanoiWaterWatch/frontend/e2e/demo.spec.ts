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
  await page.getByRole('region',{name:'Notifications'}).getByRole('link',{name:/pH above the reference band/}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('pH above the reference band');
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

  await page.goto('/simulation');
  await page.getByRole('button',{name:'Start replay'}).click();
  await expect(page.locator('.demo-result-note')).toHaveText('Simulated result · Not an observed measurement');
  await expect(page.getByRole('table')).toContainText('Turbidity');
  await page.getByRole('button',{name:'Stop replay'}).click();
  await expect(page.getByRole('button',{name:'Start replay'})).toBeEnabled();
  expect(monitoringRequests).toEqual([]);
});
