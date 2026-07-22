import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const aliases = {
  '@talent-lab/contracts': path.join(here, 'packages/contracts/src/index.ts'),
  '@talent-lab/database': path.join(here, 'packages/database/src/index.ts'),
  '@talent-lab/testing': path.join(here, 'packages/testing/src/index.ts'),
  '@talent-lab/ui': path.join(here, 'packages/ui/src/index.ts'),
};

export const reportOutput = (suite: string) => ({
  junit: `reports/generated/vitest/${suite}.xml`,
  json: `reports/generated/vitest/${suite}.json`,
});
