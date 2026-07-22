import { defineConfig } from 'vitest/config';
import { aliases, reportOutput } from './vitest.shared.js';

export default defineConfig({
  resolve: { alias: aliases },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    reporters: ['default', 'junit', 'json'],
    outputFile: reportOutput('unit'),
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: 'reports/generated/coverage/unit',
      include: ['packages/contracts/src/**/*.ts', 'packages/database/src/password.ts'],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 },
    },
  },
});
