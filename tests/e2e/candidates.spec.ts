import { randomUUID } from 'node:crypto';
import { expect, test } from './fixtures.js';

test('@p0 @smoke recruiter creates a candidate without double submit', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Create candidate' }).first().click();
  await expect(page.getByRole('dialog', { name: 'Create candidate' })).toBeVisible();
  await page.getByLabel('First name').fill('Playwright'); await page.getByLabel('Last name').fill('Candidate');
  const email = `playwright-${randomUUID()}@example.test`; await page.getByLabel('Email').fill(email); await page.getByLabel('Location').fill('Bogotá');
  const save = page.getByRole('button', { name: 'Save candidate' }); await save.dblclick();
  await expect(page.getByRole('status').filter({ hasText: 'Playwright Candidate created' })).toBeVisible();
  await page.getByLabel('Filter candidates').fill(email); await page.getByRole('button', { name: 'Apply filter' }).click();
  await expect(page.getByRole('cell', { name: email })).toBeVisible();
});

test('@p1 @regression keyboard focus enters and exits candidate dialog', async ({ page }) => {
  await page.goto('/'); await page.keyboard.press('Tab');
  const create = page.getByRole('button', { name: 'Create candidate' }).first(); await create.focus(); await page.keyboard.press('Enter');
  await expect(page.getByLabel('First name')).toBeFocused(); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toBeHidden();
});

test('@p1 @regression handles temporary candidate network failure', async ({ page }) => {
  await page.route('**/api/candidates**', (route) => route.abort('internetdisconnected')); await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('temporarily unreachable');
});

test('@p1 @regression expired session returns to login', async ({ page }) => {
  await page.addInitScript(() => { const session = JSON.parse(localStorage.getItem('talent-lab-session') ?? '{}'); session.token = 'expired.invalid.token'; localStorage.setItem('talent-lab-session', JSON.stringify(session)); });
  await page.goto('/'); await expect(page.getByRole('heading', { name: 'Sign in to the interview workspace' })).toBeVisible(); await expect(page.getByRole('alert')).toContainText('session expired');
});
