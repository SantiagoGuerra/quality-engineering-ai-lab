import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${process.env.WEB_PORT ?? 4173}`;

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 7_000, toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.01 } },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/generated/playwright/html', open: 'never' }],
    ['junit', { outputFile: 'reports/generated/playwright/junit.xml' }],
    ['json', { outputFile: 'reports/generated/playwright/results.json' }],
    ['./scripts/reports/playwright-metadata-reporter.ts'],
  ],
  use: {
    baseURL,
    locale: 'en-US',
    timezoneId: 'America/Bogota',
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },
  ...(process.env.PLAYWRIGHT_EXTERNAL_SERVER === 'true'
    ? {}
    : {
        webServer: {
          command: 'pnpm qa:start',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 240_000,
        },
      }),
  projects: [
    { name: 'auth-setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium-desktop',
      testIgnore: /auth\.setup\.ts/,
      dependencies: ['auth-setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'artifacts/auth/recruiter.json' },
    },
    {
      name: 'firefox-desktop',
      testIgnore: /auth\.setup\.ts/,
      dependencies: ['auth-setup'],
      use: { ...devices['Desktop Firefox'], storageState: 'artifacts/auth/recruiter.json' },
    },
    {
      name: 'webkit-desktop',
      testIgnore: /auth\.setup\.ts/,
      dependencies: ['auth-setup'],
      use: { ...devices['Desktop Safari'], storageState: 'artifacts/auth/recruiter.json' },
    },
    {
      name: 'mobile-chrome',
      testIgnore: /auth\.setup\.ts/,
      dependencies: ['auth-setup'],
      use: { ...devices['Pixel 7'], storageState: 'artifacts/auth/recruiter.json' },
    },
    {
      name: 'admin-chromium',
      testMatch: /roles\.spec\.ts/,
      dependencies: ['auth-setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'artifacts/auth/admin.json' },
    },
    {
      name: 'reviewer-chromium',
      testMatch: /roles\.spec\.ts/,
      dependencies: ['auth-setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'artifacts/auth/reviewer.json' },
    },
    {
      name: 'candidate-chromium',
      testMatch: /roles\.spec\.ts/,
      dependencies: ['auth-setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'artifacts/auth/candidate.json' },
    },
  ],
});
