import { expect, test } from '@playwright/test';

test.describe('Playwright Agent generated draft', () => {
  test('@p1 agent draft authenticates with synthetic data', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await page.getByLabel('Email').fill('reviewer@talent.test');
    await page.getByLabel('Password').fill('QaDemo!2026');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Interview operations' })).toBeVisible();
  });
});
