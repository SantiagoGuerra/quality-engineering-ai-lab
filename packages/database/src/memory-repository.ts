import { randomUUID } from 'node:crypto';
import type { Candidate, CandidateInput, InterviewStatus } from '@talent-lab/contracts';
import { ConflictError, DuplicateError, NotFoundError, type AuditEntry, type CandidatePage, type Evaluation, type Interview, type Project, type StoredUser, type TalentRepository } from './types.js';
import { hashPassword } from './password.js';

const now = (): string => new Date().toISOString();

export class MemoryTalentRepository implements TalentRepository {
  readonly users: StoredUser[];
  readonly candidates: Candidate[] = [];
  readonly projects: Project[] = [];
  readonly interviews: Interview[] = [];
  readonly evaluations: Evaluation[] = [];
  readonly audits: AuditEntry[] = [];
  readonly idempotency = new Map<string, unknown>();

  constructor() {
    this.users = [
      { id: '00000000-0000-4000-8000-000000000001', email: 'admin@talent.test', name: 'Ada Admin', role: 'admin', passwordHash: hashPassword('QaDemo!2026', 'admin-seed') },
      { id: '00000000-0000-4000-8000-000000000002', email: 'recruiter@talent.test', name: 'Rita Recruiter', role: 'recruiter', passwordHash: hashPassword('QaDemo!2026', 'recruiter-seed') },
      { id: '00000000-0000-4000-8000-000000000003', email: 'reviewer@talent.test', name: 'Rene Reviewer', role: 'reviewer', passwordHash: hashPassword('QaDemo!2026', 'reviewer-seed') },
      { id: '00000000-0000-4000-8000-000000000004', email: 'candidate@talent.test', name: 'Cam Candidate', role: 'candidate', passwordHash: hashPassword('QaDemo!2026', 'candidate-seed') },
    ];
  }

  async getUserByEmail(email: string): Promise<StoredUser | null> { return this.users.find((user) => user.email === email) ?? null; }
  async listCandidates(page: number, pageSize: number, q: string): Promise<CandidatePage> {
    const needle = q.toLowerCase();
    const all = this.candidates.filter((item) => `${item.email} ${item.firstName} ${item.lastName}`.toLowerCase().includes(needle));
    return { items: all.slice((page - 1) * pageSize, page * pageSize), page, pageSize, total: all.length };
  }
  async getCandidate(id: string): Promise<Candidate | null> { return this.candidates.find((item) => item.id === id) ?? null; }
  async createCandidate(input: CandidateInput): Promise<Candidate> {
    if (this.candidates.some((item) => item.email === input.email)) throw new DuplicateError('candidate email already exists');
    const timestamp = now();
    const item: Candidate = { id: randomUUID(), email: input.email, firstName: input.firstName, lastName: input.lastName, ...(input.phone ? { phone: input.phone } : {}), ...(input.location ? { location: input.location } : {}), ...(input.notes ? { notes: input.notes } : {}), version: 1, createdAt: timestamp, updatedAt: timestamp };
    this.candidates.push(item); return item;
  }
  async updateCandidate(id: string, expectedVersion: number, input: CandidateInput): Promise<Candidate> {
    const index = this.candidates.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundError('candidate not found');
    if (this.candidates[index]!.version !== expectedVersion) throw new ConflictError('candidate has changed');
    const current = this.candidates[index]!;
    const updated: Candidate = { ...current, ...input, version: current.version + 1, updatedAt: now() };
    this.candidates[index] = updated; return updated;
  }
  async createProject(input: { name: string; description?: string }): Promise<Project> {
    const item: Project = { id: randomUUID(), name: input.name, ...(input.description ? { description: input.description } : {}), createdAt: now() };
    this.projects.push(item); return item;
  }
  async listProjects(): Promise<Project[]> { return [...this.projects]; }
  async associateCandidate(projectId: string, candidateId: string): Promise<void> {
    if (!this.projects.some((item) => item.id === projectId) || !this.candidates.some((item) => item.id === candidateId)) throw new NotFoundError('project or candidate not found');
  }
  async createInterview(input: Omit<Interview, 'id' | 'status' | 'version'>): Promise<Interview> {
    const item: Interview = { ...input, id: randomUUID(), status: 'scheduled', version: 1 };
    this.interviews.push(item); return item;
  }
  async updateInterviewStatus(id: string, status: InterviewStatus, expectedVersion: number): Promise<Interview> {
    const index = this.interviews.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundError('interview not found');
    if (this.interviews[index]!.version !== expectedVersion) throw new ConflictError('interview has changed');
    const updated = { ...this.interviews[index]!, status, version: expectedVersion + 1 };
    this.interviews[index] = updated; return updated;
  }
  async getInterview(id: string): Promise<Interview | null> { return this.interviews.find((item) => item.id === id) ?? null; }
  async createEvaluation(input: Omit<Evaluation, 'id' | 'createdAt'>): Promise<Evaluation> {
    if (this.evaluations.some((item) => item.interviewId === input.interviewId && item.reviewerId === input.reviewerId)) throw new DuplicateError('evaluation already exists');
    const item = { ...input, id: randomUUID(), createdAt: now() }; this.evaluations.push(item); return item;
  }
  async listEvaluations(interviewId: string): Promise<Evaluation[]> { return this.evaluations.filter((item) => item.interviewId === interviewId); }
  async recordAudit(entry: Omit<AuditEntry, 'id' | 'createdAt'>): Promise<void> { this.audits.push({ ...entry, id: randomUUID(), createdAt: now() }); }
  async listAudit(): Promise<AuditEntry[]> { return [...this.audits].reverse(); }
  async getIdempotentResponse(key: string): Promise<unknown | null> { return this.idempotency.get(key) ?? null; }
  async saveIdempotentResponse(key: string, response: unknown): Promise<void> { if (!this.idempotency.has(key)) this.idempotency.set(key, response); }
  async close(): Promise<void> {}
}
