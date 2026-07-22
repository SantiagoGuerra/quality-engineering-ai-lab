import type { Pool } from 'pg';

const migrations = [
  {
    id: '001_initial',
    sql: `
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        email text NOT NULL UNIQUE,
        name text NOT NULL,
        role text NOT NULL CHECK (role IN ('admin','recruiter','reviewer','candidate')),
        password_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS candidates (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL UNIQUE,
        first_name text NOT NULL,
        last_name text NOT NULL,
        phone text,
        location text,
        notes text,
        version integer NOT NULL DEFAULT 1,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS projects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        description text,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS project_candidates (
        project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
        PRIMARY KEY (project_id, candidate_id)
      );
      CREATE TABLE IF NOT EXISTS interviews (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        candidate_id uuid NOT NULL REFERENCES candidates(id),
        project_id uuid NOT NULL REFERENCES projects(id),
        reviewer_id uuid NOT NULL REFERENCES users(id),
        scheduled_at timestamptz NOT NULL,
        status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','invited','in_progress','completed','cancelled')),
        version integer NOT NULL DEFAULT 1,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS evaluations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
        reviewer_id uuid NOT NULL REFERENCES users(id),
        score numeric(3,2) NOT NULL CHECK (score >= 0 AND score <= 5),
        recommendation text NOT NULL CHECK (recommendation IN ('strong_no','no','yes','strong_yes')),
        notes text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (interview_id, reviewer_id)
      );
      CREATE TABLE IF NOT EXISTS audit_log (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_id uuid NOT NULL REFERENCES users(id),
        action text NOT NULL,
        entity_type text NOT NULL,
        entity_id uuid,
        metadata jsonb NOT NULL DEFAULT '{}',
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS idempotency_keys (
        key text PRIMARY KEY,
        response jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `,
  },
] as const;

export async function migrate(pool: Pool): Promise<void> {
  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  for (const migration of migrations) {
    const found = await pool.query<{ id: string }>('SELECT id FROM schema_migrations WHERE id = $1', [migration.id]);
    if (found.rowCount) continue;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(migration.sql);
      await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [migration.id]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
