import type { Pool, PoolClient } from 'pg';
import { hashPassword } from './password.js';

export const seedScenarios = ['default', 'empty-state', 'candidate-creation', 'candidate-duplicate', 'permission-denied', 'interview-complete', 'performance-data', 'accessibility-review'] as const;
export type SeedScenario = (typeof seedScenarios)[number];

const ids = {
  admin: '00000000-0000-4000-8000-000000000001', recruiter: '00000000-0000-4000-8000-000000000002',
  reviewer: '00000000-0000-4000-8000-000000000003', candidateUser: '00000000-0000-4000-8000-000000000004',
  candidate: '10000000-0000-4000-8000-000000000001', project: '20000000-0000-4000-8000-000000000001', interview: '30000000-0000-4000-8000-000000000001',
};

async function base(client: PoolClient): Promise<void> {
  const passwordHash = hashPassword('QaDemo!2026', 'talent-lab-fixed-seed');
  const users = [
    [ids.admin, 'admin@talent.test', 'Ada Admin', 'admin'],
    [ids.recruiter, 'recruiter@talent.test', 'Rita Recruiter', 'recruiter'],
    [ids.reviewer, 'reviewer@talent.test', 'Rene Reviewer', 'reviewer'],
    [ids.candidateUser, 'candidate@talent.test', 'Cam Candidate', 'candidate'],
  ];
  for (const [id, email, name, role] of users) await client.query('INSERT INTO users (id,email,name,role,password_hash) VALUES ($1,$2,$3,$4,$5)', [id, email, name, role, passwordHash]);
}

async function standardData(client: PoolClient, candidateEmail = 'alex.rivera@example.test'): Promise<void> {
  await client.query('INSERT INTO candidates (id,email,first_name,last_name,location,notes) VALUES ($1,$2,$3,$4,$5,$6)', [ids.candidate, candidateEmail, 'Alex', 'Rivera', 'Bogotá', 'Seed de QA, sin datos reales']);
  await client.query('INSERT INTO projects (id,name,description) VALUES ($1,$2,$3)', [ids.project, 'Platform Engineer', 'Proyecto demostrativo']);
  await client.query('INSERT INTO project_candidates (project_id,candidate_id) VALUES ($1,$2)', [ids.project, ids.candidate]);
}

export async function seedDatabase(pool: Pool, scenario: SeedScenario): Promise<void> {
  if (!seedScenarios.includes(scenario)) throw new Error(`Unknown seed: ${scenario}`);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE audit_log, evaluations, interviews, project_candidates, projects, candidates, idempotency_keys, users RESTART IDENTITY CASCADE');
    await base(client);
    if (scenario === 'empty-state' || scenario === 'candidate-creation' || scenario === 'permission-denied') {
      if (scenario === 'candidate-creation') await client.query('INSERT INTO projects (id,name,description) VALUES ($1,$2,$3)', [ids.project, 'Candidate creation', 'Escenario enfocado']);
    } else if (scenario === 'performance-data') {
      await standardData(client);
      for (let index = 2; index <= 250; index += 1) {
        await client.query('INSERT INTO candidates (email,first_name,last_name,location) VALUES ($1,$2,$3,$4)', [`candidate-${index}@example.test`, `Candidate ${index}`, 'Performance', index % 2 ? 'Bogotá' : 'Remote']);
      }
    } else {
      await standardData(client, scenario === 'candidate-duplicate' ? 'duplicate@example.test' : 'alex.rivera@example.test');
    }
    if (scenario === 'interview-complete') {
      await client.query("INSERT INTO interviews (id,candidate_id,project_id,reviewer_id,scheduled_at,status) VALUES ($1,$2,$3,$4,now() - interval '1 day','completed')", [ids.interview, ids.candidate, ids.project, ids.reviewer]);
      await client.query("INSERT INTO evaluations (interview_id,reviewer_id,score,recommendation,notes) VALUES ($1,$2,4.5,'strong_yes','Strong structured evidence')", [ids.interview, ids.reviewer]);
    }
    if (scenario === 'accessibility-review') {
      await client.query('UPDATE candidates SET first_name=$1,last_name=$2,notes=$3 WHERE id=$4', ['Zoë', "O’Connor-李", 'Texto largo con caracteres especiales: áéíóú — 日本語', ids.candidate]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
