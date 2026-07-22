import { argument, run } from './common.js';

const seed = argument('--seed', process.env.QA_SEED ?? 'default');
run('docker', ['compose', 'exec', '-T', 'api', 'pnpm', '--filter', '@talent-lab/database', 'reset', '--', `--seed=${seed}`]);
console.log(`Database reset with seed '${seed}'.`);
