import { defineConfig } from 'vitest/config';
import { aliases, reportOutput } from './vitest.shared.js';

export default defineConfig({ resolve: { alias: aliases }, test: { include: ['tests/property/**/*.test.ts'], environment: 'node', reporters: ['default', 'junit', 'json'], outputFile: reportOutput('property') } });
