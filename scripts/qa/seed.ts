import { argument, run } from './common.js';

const seedScenarios = ['default', 'empty-state', 'candidate-creation', 'candidate-duplicate', 'permission-denied', 'interview-complete', 'performance-data', 'accessibility-review'] as const;
const seed = argument('--seed', process.env.QA_SEED ?? 'default') as (typeof seedScenarios)[number];
if (!seedScenarios.includes(seed)) throw new Error(`Invalid seed '${seed}'. Choose: ${seedScenarios.join(', ')}`);
run('docker', ['compose', 'exec', '-T', 'api', 'pnpm', '--filter', '@talent-lab/database', 'seed', '--', `--seed=${seed}`]);
console.log(`Seed '${seed}' applied.`);
