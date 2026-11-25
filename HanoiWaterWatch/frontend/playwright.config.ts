import { defineConfig } from '@playwright/test';

const port = process.env.HWW_E2E_PORT || '8176';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  timeout: 45000,
  expect: { timeout: 12000 },
  forbidOnly: !!process.env.CI,
  use: {
    baseURL,
    locale: 'en-US',
    trace: 'retain-on-failure',
    launchOptions: { executablePath: process.env.HWW_BROWSER_EXECUTABLE },
  },
});
