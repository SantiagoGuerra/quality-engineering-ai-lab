import { expect, test } from './fixtures.js';

test('@intentional-failure evidence fixture records screenshot, video and trace', async ({ page }) => {
  test.skip(process.env.DEMO_INTENTIONAL_FAILURE !== '1', 'Executed only by the controlled evidence workflow');
  await page.addInitScript(() => localStorage.clear()); await page.goto('/');
  await expect(page.getByRole('heading', { name: 'This heading intentionally does not exist' })).toBeVisible({ timeout: 1_000 });
});
