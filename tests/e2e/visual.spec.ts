import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.js';

const goldenCandidates = {
  items: [
    {
      id: '10000000-0000-4000-8000-000000000001',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada.lovelace@example.test',
      location: 'Bogotá',
      version: 3,
      createdAt: '2026-07-21T12:00:00.000Z',
      updatedAt: '2026-07-21T12:00:00.000Z',
    },
    {
      id: '10000000-0000-4000-8000-000000000002',
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace.hopper@example.test',
      location: 'Medellín',
      version: 1,
      createdAt: '2026-07-21T12:00:00.000Z',
      updatedAt: '2026-07-21T12:00:00.000Z',
    },
    {
      id: '10000000-0000-4000-8000-000000000003',
      firstName: 'Katherine',
      lastName: 'Johnson',
      email: 'katherine.johnson@example.test',
      location: 'Cali',
      version: 2,
      createdAt: '2026-07-21T12:00:00.000Z',
      updatedAt: '2026-07-21T12:00:00.000Z',
    },
  ],
  page: 1,
  pageSize: 10,
  total: 3,
};

async function mockCandidates(page: Page, body: unknown, status = 200) {
  await page.route('**/api/candidates**', (route) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }),
  );
}

test('@visual @golden stable login page at desktop viewport', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  if (process.env.VISUAL_VARIANT === 'controlled-difference')
    await page.addStyleTag({ content: '.login-card { transform: translateX(24px); }' });
  await expect(page).toHaveScreenshot('login-desktop.png', { fullPage: true });
});

test('@visual @golden @p1 responsive login reflows without horizontal scrolling', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.clear());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await expect(page).toHaveScreenshot('login-mobile.png', { fullPage: true });
});

test('@visual @golden populated candidate table uses frozen synthetic data', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await mockCandidates(page, goldenCandidates);
  await page.goto('/');
  await expect(page.getByRole('table', { name: '3 candidates' })).toBeVisible();
  await expect(page).toHaveScreenshot('candidates-populated.png', { fullPage: true });
});

test('@visual @golden empty state is protected from regressions', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await mockCandidates(page, { items: [], page: 1, pageSize: 10, total: 0 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'No candidates found' })).toBeVisible();
  await expect(page).toHaveScreenshot('candidates-empty.png', { fullPage: true });
});

test('@visual @golden API failure renders a recoverable error state', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await mockCandidates(
    page,
    {
      error: {
        code: 'GOLDEN_FIXTURE_ERROR',
        message: 'The candidate service is temporarily unavailable.',
      },
    },
    503,
  );
  await page.goto('/');
  await expect(page.getByText('The candidate service is temporarily unavailable.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(page).toHaveScreenshot('candidates-error.png', { fullPage: true });
});

test('@visual @golden create dialog preserves form hierarchy and focus', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await mockCandidates(page, goldenCandidates);
  await page.goto('/');
  await page.getByRole('button', { name: 'Create candidate' }).click();
  await expect(page.getByRole('dialog', { name: 'Create candidate' })).toBeVisible();
  await expect(page.getByLabel('First name')).toBeFocused();
  await expect(page).toHaveScreenshot('candidate-create-dialog.png', { fullPage: true });
});

test('@visual @golden candidate role stays read-only', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'talent-lab-session',
      JSON.stringify({
        token: 'golden-candidate-token',
        expiresInSeconds: 3600,
        user: {
          id: '20000000-0000-4000-8000-000000000001',
          email: 'candidate@example.test',
          name: 'Jordan Candidate',
          role: 'candidate',
        },
      }),
    );
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(
    page.getByText('Candidate self-service is intentionally read-only in this demo.'),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('candidate-read-only.png', { fullPage: true });
});
