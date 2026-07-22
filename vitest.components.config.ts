import { defineConfig } from 'vitest/config';
import { aliases, reportOutput } from './vitest.shared.js';

export default defineConfig({
  resolve: { alias: aliases },
  test: {
    include: ['tests/components/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: ['tests/components/setup.ts'],
    reporters: ['default', 'junit', 'json'],
    outputFile: reportOutput('components'),
  },
});
