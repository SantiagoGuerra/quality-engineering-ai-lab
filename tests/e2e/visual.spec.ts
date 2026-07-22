import { expect, test } from './fixtures.js';

test('@visual stable login page at desktop viewport', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear()); await page.setViewportSize({ width: 1280, height: 800 }); await page.goto('/');
  if (process.env.VISUAL_VARIANT === 'controlled-difference') await page.addStyleTag({ content: '.login-card { transform: translateX(24px); }' });
  await expect(page).toHaveScreenshot('login-desktop.png', { fullPage: true });
});

test('@visual @p1 responsive login reflows without horizontal scrolling', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear()); await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page).toHaveScreenshot('login-mobile.png', { fullPage: true });
});
