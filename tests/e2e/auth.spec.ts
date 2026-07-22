import { expect, test } from './fixtures.js';

test('@p0 @smoke login and logout preserve semantic authentication flow', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear()); await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in to the interview workspace' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).fill('recruiter@talent.test');
  await page.getByLabel('Password').fill('QaDemo!2026'); await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Interview operations' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to the interview workspace' })).toBeVisible();
});

test('@p1 @regression rejects invalid credentials with an alert', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear()); await page.goto('/');
  await page.getByLabel('Password').fill('WrongPassword!'); await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'incorrect' })).toHaveCount(1);
  await expect(page.getByText('Your session expired')).toHaveCount(0);
});
