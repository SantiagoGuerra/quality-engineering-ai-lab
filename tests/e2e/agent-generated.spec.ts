// Reviewed output derived from artifacts/demos/agents/generated-test-raw.md.
import { randomUUID } from 'node:crypto';
import { expect, test } from './fixtures.js';

test('@p1 @regression @agent reviewed agent draft prevents rapid double submit', async ({ page }) => {
  let createRequests = 0;
  page.on('request', (request) => {
    if (request.method() === 'POST' && new URL(request.url()).pathname.endsWith('/candidates')) createRequests += 1;
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Create candidate' }).first().click();
  await page.getByLabel('First name').fill('Playwright');
  await page.getByLabel('Last name').fill('Agent');
  const email = `agent-${randomUUID()}@example.test`;
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Location').fill('Bogotá');
  await page.getByRole('button', { name: 'Save candidate' }).dblclick();
  await expect(page.getByRole('status').filter({ hasText: 'Playwright Agent created' })).toBeVisible();
  expect(createRequests).toBe(1);
  await page.getByLabel('Filter candidates').fill(email);
  await page.getByRole('button', { name: 'Apply filter' }).click();
  await expect(page.getByRole('row', { name: new RegExp(email) })).toHaveCount(1);
});
