import { defineConfig } from 'vitest/config';
import { aliases, reportOutput } from './vitest.shared.js';

export default defineConfig({ resolve: { alias: aliases }, test: { include: ['tests/integration/**/*.test.ts'], environment: 'node', testTimeout: 120_000, hookTimeout: 120_000, reporters: ['default', 'junit', 'json'], outputFile: reportOutput('integration'), pool: 'forks', maxWorkers: 1 } });
