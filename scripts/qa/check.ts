import { run } from './common.js';

for (const command of ['build', 'lint', 'typecheck', 'test:unit', 'test:components', 'test:api', 'test:property']) run('pnpm', [command]);
console.log('Fast pre-PR quality gate passed.');
