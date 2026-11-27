import { expect, test } from '@playwright/test';

test.skip(process.env.HWW_E2E_DEMO === '1', 'Exercises the isolated API-backed registry.');

test('admin creates, pauses, resumes and archives a station with historical access', async ({page}) => {
  test.setTimeout(90000);
  const station = 'HWW-QAT-019';
  const confirm = page.getByRole('button', {name: 'Confirm', exact: true});
  const session = await page.request.post('/api/v1/auth/login', {
    headers: {'X-Requested-With': 'hww'},
    data: {username: process.env.HWW_E2E_ADMIN_USERNAME!, password: process.env.HWW_E2E_ADMIN_PASSWORD!}
  });
  expect(session.ok()).toBeTruthy();
  await page.goto('/admin');
  await page.getByText('Create station', {exact: true}).click();
  await page.getByLabel('Station code').fill(station);
  await page.getByLabel('English name').fill('Registry check');
  await page.getByLabel('Vietnamese name').fill('Trạm kiểm tra');
  await page.getByLabel('River', {exact: true}).fill('Nhuệ');
  await page.getByLabel('Latitude').fill('21.01');
  await page.getByLabel('Longitude').fill('105.79');
  await page.getByLabel('Reason for creation').fill('Verify the isolated station registry');
  await page.getByRole('button', {name: 'Review new station'}).click();
  await expect(page.getByRole('region', {name: 'Confirm action'})).toContainText(station);
  await confirm.click();
  await page.getByLabel('Manage station').selectOption(station);
  for (const [lifecycle, title] of [['maintenance', 'Maintenance'], ['active', 'Active'], ['archived', 'Archived']]) {
    await page.getByLabel('New status').selectOption(lifecycle);
    await page.getByLabel('Reason for change').fill('Registry verification ' + title);
    await page.getByRole('button', {name: 'Review change'}).click();
    await expect(page.getByRole('region', {name: 'Confirm action'})).toContainText(title);
    await confirm.click();
    await expect(page.getByLabel('Manage station').locator('option:checked')).toContainText(title);
    const list = await (await page.request.get('/api/v1/stations')).json();
    expect(list.items.some((s: {code:string}) => s.code === station)).toBe(lifecycle !== 'archived');
  }
  await expect(page.locator('.admin-audit')).toContainText('Registry verification Archived');
  await page.getByRole('combobox', {name:'Station', exact:true}).selectOption(station);
  await expect(page.getByRole('link', {name: 'Explore trend chart'})).toHaveAttribute('href', new RegExp(station));
  await page.getByRole('link', {name: 'Explore trend chart'}).click();
  await expect(page).toHaveURL(new RegExp('/stations/' + station + '/dashboard'));
  await expect(page.locator('main').getByText('Archived', {exact: true})).toBeVisible();
});
