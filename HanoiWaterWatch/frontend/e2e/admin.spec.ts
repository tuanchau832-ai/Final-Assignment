import { randomUUID } from 'node:crypto';
import { expect, test, type APIRequestContext } from '@playwright/test';

test.skip(process.env.HWW_E2E_DEMO === '1', 'The standard build checks server authorization and delivery.');

const json = { 'Content-Type':'application/json', 'X-Requested-With':'hww' };
const post = (api: APIRequestContext, path: string, data: object) =>
  api.post('/api/v1' + path, { headers:json, data });

test('admin access and addressed announcements stay scoped across accounts', async ({ page, browser, baseURL }) => {
  const administration = page.getByRole('link', {name:'Admin', exact:true});
  const signIn = async (username: string, password: string) => {
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password', {exact:true}).fill(password);
    await page.getByRole('button', {name:'Sign in', exact:true}).click();
  };
  const reviewer = process.env.HWW_E2E_USERNAME!;
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/login\?returnTo=%2Fadmin$/);
  expect((await page.request.get('/api/v1/admin/stations')).status()).toBe(401);
  await signIn(reviewer, process.env.HWW_E2E_PASSWORD!);
  await expect(page).toHaveURL(/\/overview$/);
  await expect(administration).toHaveCount(0);
  expect((await page.request.get('/api/v1/admin/stations')).status()).toBe(403);
  await page.getByRole('button', {name:'Account', exact:true}).click();
  await page.getByRole('button', {name:'Sign out', exact:true}).click();
  await page.goto('/admin');
  await signIn(process.env.HWW_E2E_ADMIN_USERNAME!, process.env.HWW_E2E_ADMIN_PASSWORD!);
  await expect(page).toHaveURL(/\/admin$/);
  await expect(administration).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', {level:1})).toBeVisible();

  const receipt = {request_id:randomUUID(), confirmed:true, audience:'operator', message:'Operator maintenance window'};
  const announcement = await post(page.request, '/admin/announcements', receipt);
  expect(announcement.ok()).toBeTruthy();
  const sent = await announcement.json();
  expect(sent).toMatchObject({recipient_count:1, outcome:'sent'});
  expect(await (await post(page.request, '/admin/announcements', receipt)).json()).toEqual(sent);
  expect((await (await page.request.get('/api/v1/notifications')).json()).items).toEqual([]);

  const recipient = await browser.newContext({baseURL});
  try {
    expect((await post(recipient.request, '/auth/login', {
      username:process.env.HWW_E2E_OPERATOR_USERNAME!, password:process.env.HWW_E2E_OPERATOR_PASSWORD!,
    })).ok()).toBeTruthy();
    expect((await post(recipient.request, '/admin/announcements', receipt)).status()).toBe(403);
    const recipientPage = await recipient.newPage();
    await recipientPage.goto('/overview');
    await expect(recipientPage.getByRole('status').filter({hasText:receipt.message})).toBeVisible();
    const [session] = await Promise.all([
      recipientPage.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/auth/me'),
      recipientPage.reload(),
    ]);
    expect(session.ok()).toBeTruthy();
    await recipientPage.getByRole('button', {name:'Notifications', exact:true}).click();
    await expect(recipientPage.getByRole('region', {name:'Notifications'})).toContainText(receipt.message);
    await expect(recipientPage.getByRole('status').filter({hasText:receipt.message})).toHaveCount(0);
  } finally {
    await recipient.close();
  }
});
