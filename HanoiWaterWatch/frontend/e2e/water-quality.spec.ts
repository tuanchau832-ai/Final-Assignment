import { test, expect } from '@playwright/test';

test('a confirmed episode and recovery arrive in order and stay silent after reload', async ({ page, request }) => {
  const headers = { 'X-Requested-With': 'hww' };
  const admin = await request.post('/api/v1/auth/login', { headers, data: {
    username: process.env.HWW_E2E_ADMIN_USERNAME, password: process.env.HWW_E2E_ADMIN_PASSWORD,
  } });
  expect(admin.ok()).toBeTruthy();
  const device = 'wokwi-esp32-01', station = 'HWW-KNG-001';
  const rotated = await request.post('/api/v1/admin/devices/' + device + '/rotate-key', { headers, data: {} });
  expect(rotated.ok()).toBeTruthy();
  const key = (await rotated.json()).key;
  await page.request.post('/api/v1/auth/login', { headers, data: {
    username: process.env.HWW_E2E_OPERATOR_USERNAME, password: process.env.HWW_E2E_OPERATOR_PASSWORD,
  } });
  const initialized = page.waitForResponse(r => r.url().endsWith('/notifications/poll') && r.ok());
  await page.goto('/overview');
  await initialized;
  const toast = page.locator('.alert-notification');
  await expect(toast).toHaveCount(0);
  const start = Date.now() - 300;
  const frames = [7, 5, 5, 5, 7, 7, 7].map((v, seq) => ({
    seq, measured_at: new Date(start + seq * 30).toISOString(), time_source: 'ntp',
    uptime_ms: seq * 30, buffered: false, mode: 'manual',
    readings: { ph: { v, q: 'ok', u: 'pH', gen: 'input' } },
  }));
  const response = await request.post('/api/v1/ingest/frames', { headers: { 'X-Device-Key': key }, data: {
    schema: 'hww.frames.v1', station_code: station, device_code: device, boot_id: 'c0ffee12',
    fw_version: 'e2e', sent_at: null, sent_uptime_ms: 300, diag: {}, frames,
  } });
  expect(response.ok()).toBeTruthy();
  await expect(toast).toContainText('Normal → Critical');
  await expect(toast).toContainText('Wokwi simulation');
  await toast.getByRole('button').click();
  await expect(toast).toContainText('Critical → Normal');
  await toast.getByRole('link').click();
  await expect(page).toHaveURL(/\/overview\/alerts\/\d+\?station=HWW-KNG-001/);
  const repolled = page.waitForResponse(r => r.url().endsWith('/notifications/poll') && r.ok());
  await page.reload();
  await repolled;
  await expect(toast).toHaveCount(0);
  await page.getByRole('button', { name: 'Notifications' }).click();
  const history = page.getByRole('region', { name: 'Notifications' });
  await expect(history.getByRole('link', { name: /Critical → Normal/ }).first()).toBeVisible();
  await expect(history.getByRole('link', { name: /Normal → Critical/ }).first()).toBeVisible();
});
