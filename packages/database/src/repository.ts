import { pageOffset, type Candidate, type CandidateInput, type InterviewStatus, type Role } from '@talent-lab/contracts';
import { Pool, type QueryResultRow } from 'pg';
import { ConflictError, DuplicateError, NotFoundError, type AuditEntry, type CandidatePage, type Evaluation, type Interview, type Project, type StoredUser, type TalentRepository } from './types.js';

function iso(value: Date | string): string {
  return new Date(value).toISOString();
}

function candidate(row: QueryResultRow): Candidate {
  return {
    id: String(row.id), email: String(row.email), firstName: String(row.first_name), lastName: String(row.last_name),
    ...(row.phone ? { phone: String(row.phone) } : {}), ...(row.location ? { location: String(row.location) } : {}),
    ...(row.notes ? { notes: String(row.notes) } : {}), version: Number(row.version), createdAt: iso(row.created_at), updatedAt: iso(row.updated_at),
  };
}

function project(row: QueryResultRow): Project {
  return { id: String(row.id), name: String(row.name), ...(row.description ? { description: String(row.description) } : {}), createdAt: iso(row.created_at) };
}

function interview(row: QueryResultRow): Interview {
  return { id: String(row.id), candidateId: String(row.candidate_id), projectId: String(row.project_id), reviewerId: String(row.reviewer_id), scheduledAt: iso(row.scheduled_at), status: row.status as InterviewStatus, version: Number(row.version) };
}

export class PgTalentRepository implements TalentRepository {
  readonly pool: Pool;

  constructor(connectionString: string | Pool) {
    this.pool = typeof connectionString === 'string' ? new Pool({ connectionString }) : connectionString;
  }

  async getUserByEmail(email: string): Promise<StoredUser | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const row = result.rows[0];
    return row ? { id: String(row.id), email: String(row.email), name: String(row.name), role: row.role as Role, passwordHash: String(row.password_hash) } : null;
  }

  async listCandidates(page: number, pageSize: number, q: string): Promise<CandidatePage> {
    const pattern = `%${q}%`;
    const [items, count] = await Promise.all([
      this.pool.query('SELECT * FROM candidates WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [pattern, pageSize, pageOffset(page, pageSize)]),
      this.pool.query<{ count: string }>('SELECT count(*) FROM candidates WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1', [pattern]),
    ]);
    return { items: items.rows.map(candidate), page, pageSize, total: Number(count.rows[0]?.count ?? 0) };
  }

  async getCandidate(id: string): Promise<Candidate | null> {
    const result = await this.pool.query('SELECT * FROM candidates WHERE id = $1', [id]);
    return result.rows[0] ? candidate(result.rows[0]) : null;
  }

  async createCandidate(input: CandidateInput): Promise<Candidate> {
    try {
      const result = await this.pool.query('INSERT INTO candidates (email, first_name, last_name, phone, location, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [input.email, input.firstName, input.lastName, input.phone ?? null, input.location ?? null, input.notes ?? null]);
      return candidate(result.rows[0]!);
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new DuplicateError('candidate email already exists');
      throw error;
    }
  }

  async updateCandidate(id: string, expectedVersion: number, input: CandidateInput): Promise<Candidate> {
    const result = await this.pool.query('UPDATE candidates SET email=$3, first_name=$4, last_name=$5, phone=$6, location=$7, notes=$8, version=version+1, updated_at=now() WHERE id=$1 AND version=$2 RETURNING *', [id, expectedVersion, input.email, input.firstName, input.lastName, input.phone ?? null, input.location ?? null, input.notes ?? null]);
    if (result.rows[0]) return candidate(result.rows[0]);
    const exists = await this.getCandidate(id);
    if (!exists) throw new NotFoundError('candidate not found');
    throw new ConflictError('candidate has changed');
  }

  async createProject(input: { name: string; description?: string }): Promise<Project> {
    const result = await this.pool.query('INSERT INTO projects (name, description) VALUES ($1,$2) RETURNING *', [input.name, input.description ?? null]);
    return project(result.rows[0]!);
  }

  async listProjects(): Promise<Project[]> {
    const result = await this.pool.query('SELECT * FROM projects ORDER BY name');
    return result.rows.map(project);
  }

  async associateCandidate(projectId: string, candidateId: string): Promise<void> {
    await this.pool.query('INSERT INTO project_candidates (project_id, candidate_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [projectId, candidateId]);
  }

  async createInterview(input: Omit<Interview, 'id' | 'status' | 'version'>): Promise<Interview> {
    const result = await this.pool.query('INSERT INTO interviews (candidate_id,project_id,reviewer_id,scheduled_at) VALUES ($1,$2,$3,$4) RETURNING *', [input.candidateId, input.projectId, input.reviewerId, input.scheduledAt]);
    return interview(result.rows[0]!);
  }

  async updateInterviewStatus(id: string, status: InterviewStatus, expectedVersion: number): Promise<Interview> {
    const result = await this.pool.query('UPDATE interviews SET status=$3, version=version+1, updated_at=now() WHERE id=$1 AND version=$2 RETURNING *', [id, expectedVersion, status]);
    if (result.rows[0]) return interview(result.rows[0]);
    if (!(await this.getInterview(id))) throw new NotFoundError('interview not found');
    throw new ConflictError('interview has changed');
  }

  async getInterview(id: string): Promise<Interview | null> {
    const result = await this.pool.query('SELECT * FROM interviews WHERE id=$1', [id]);
    return result.rows[0] ? interview(result.rows[0]) : null;
  }

  async createEvaluation(input: Omit<Evaluation, 'id' | 'createdAt'>): Promise<Evaluation> {
    try {
      const result = await this.pool.query('INSERT INTO evaluations (interview_id,reviewer_id,score,recommendation,notes) VALUES ($1,$2,$3,$4,$5) RETURNING *', [input.interviewId, input.reviewerId, input.score, input.recommendation, input.notes]);
      const row = result.rows[0]!;
      return { id: String(row.id), interviewId: String(row.interview_id), reviewerId: String(row.reviewer_id), score: Number(row.score), recommendation: row.recommendation as Evaluation['recommendation'], notes: String(row.notes), createdAt: iso(row.created_at) };
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new DuplicateError('evaluation already exists');
      throw error;
    }
  }

  async listEvaluations(interviewId: string): Promise<Evaluation[]> {
    const result = await this.pool.query('SELECT * FROM evaluations WHERE interview_id=$1 ORDER BY created_at', [interviewId]);
    return result.rows.map((row) => ({ id: String(row.id), interviewId: String(row.interview_id), reviewerId: String(row.reviewer_id), score: Number(row.score), recommendation: row.recommendation as Evaluation['recommendation'], notes: String(row.notes), createdAt: iso(row.created_at) }));
  }

  async recordAudit(entry: Omit<AuditEntry, 'id' | 'createdAt'>): Promise<void> {
    await this.pool.query('INSERT INTO audit_log (actor_id,action,entity_type,entity_id,metadata) VALUES ($1,$2,$3,$4,$5)', [entry.actorId, entry.action, entry.entityType, entry.entityId ?? null, JSON.stringify(entry.metadata)]);
  }

  async listAudit(): Promise<AuditEntry[]> {
    const result = await this.pool.query('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200');
    return result.rows.map((row) => ({ id: String(row.id), actorId: String(row.actor_id), action: String(row.action), entityType: String(row.entity_type), ...(row.entity_id ? { entityId: String(row.entity_id) } : {}), metadata: row.metadata as Record<string, unknown>, createdAt: iso(row.created_at) }));
  }

  async getIdempotentResponse(key: string): Promise<unknown | null> {
    const result = await this.pool.query('SELECT response FROM idempotency_keys WHERE key=$1', [key]);
    return result.rows[0]?.response ?? null;
  }

  async saveIdempotentResponse(key: string, response: unknown): Promise<void> {
    await this.pool.query('INSERT INTO idempotency_keys (key,response) VALUES ($1,$2) ON CONFLICT DO NOTHING', [key, JSON.stringify(response)]);
  }

  async close(): Promise<void> { await this.pool.end(); }
}
