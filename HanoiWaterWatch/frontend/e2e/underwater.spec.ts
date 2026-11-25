import { test, expect } from '@playwright/test';

test('the underwater film plays automatically, pauses when hidden, and honors reduced motion', async ({ page }) => {
  await page.goto('/login');
  const video=page.locator('.entry-video');
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((v:HTMLVideoElement)=>[v.loop,v.muted,v.playsInline,v.duration])).toEqual([true,true,true,8]);
  await expect(page.getByRole('button', { name: /^(pause|play) background$/i })).toHaveCount(0);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(false);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(video).toHaveCount(0);
  await expect(page.locator('.entry-current')).toHaveCount(0);
  await expect(page.locator('.entry-poster')).toBeVisible();
  await page.getByRole('link',{name:'Explore the map'}).click();
  await expect(page).toHaveURL(/\/map$/);
});

test('failed film decoding leaves a usable illustrated entry',async ({ page })=>{
  await page.route('**/underwater.mp4',route=>route.abort());
  await page.goto('/login');
  await expect(page.locator('.entry-poster')).toBeVisible();
  await expect(page.getByLabel('Username')).toBeEditable();
  await expect(page.locator('video')).toHaveCount(0);
});
