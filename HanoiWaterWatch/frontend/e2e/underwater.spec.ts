import { test, expect } from '@playwright/test';

test('the underwater film plays, pauses, and yields to the static poster', async ({ page }) => {
  await page.goto('/login');
  const video=page.locator('.entry-video');
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((v:HTMLVideoElement)=>[v.loop,v.muted,v.playsInline,v.duration])).toEqual([true,true,true,8]);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
  await page.getByRole('button',{name:'Play background'}).click();
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
