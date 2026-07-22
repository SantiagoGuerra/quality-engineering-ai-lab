import process from 'node:process';
import { Pool } from 'pg';
import { migrate } from './migrate.js';
import { seedDatabase, seedScenarios, type SeedScenario } from './seed.js';

const databaseUrl = process.env.DATABASE_URL ?? 'postgres://talent:talent_local@localhost:54329/talent_lab';
const command = process.argv[2] ?? 'migrate';
const scenario = (process.argv.find((arg) => arg.startsWith('--seed='))?.split('=')[1] ?? process.env.QA_SEED ?? 'default') as SeedScenario;

if (!seedScenarios.includes(scenario)) throw new Error(`Invalid seed '${scenario}'. Expected: ${seedScenarios.join(', ')}`);

const pool = new Pool({ connectionString: databaseUrl });
try {
  await migrate(pool);
  if (command === 'seed' || command === 'reset') await seedDatabase(pool, scenario);
  process.stdout.write(`${JSON.stringify({ command, scenario, status: 'ok' })}\n`);
} finally {
  await pool.end();
}
