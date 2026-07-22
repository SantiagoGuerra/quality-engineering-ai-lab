import type { Candidate, CandidateInput, InterviewStatus, Role } from '@talent-lab/contracts';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  projectId: string;
  reviewerId: string;
  scheduledAt: string;
  status: InterviewStatus;
  version: number;
}

export interface Evaluation {
  id: string;
  interviewId: string;
  reviewerId: string;
  score: number;
  recommendation: 'strong_no' | 'no' | 'yes' | 'strong_yes';
  notes: string;
  createdAt: string;
}

export interface CandidatePage {
  items: Candidate[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface TalentRepository {
  getUserByEmail(email: string): Promise<StoredUser | null>;
  listCandidates(page: number, pageSize: number, q: string): Promise<CandidatePage>;
  getCandidate(id: string): Promise<Candidate | null>;
  createCandidate(input: CandidateInput): Promise<Candidate>;
  updateCandidate(id: string, expectedVersion: number, input: CandidateInput): Promise<Candidate>;
  createProject(input: { name: string; description?: string }): Promise<Project>;
  listProjects(): Promise<Project[]>;
  associateCandidate(projectId: string, candidateId: string): Promise<void>;
  createInterview(input: Omit<Interview, 'id' | 'status' | 'version'>): Promise<Interview>;
  updateInterviewStatus(id: string, status: InterviewStatus, expectedVersion: number): Promise<Interview>;
  getInterview(id: string): Promise<Interview | null>;
  createEvaluation(input: Omit<Evaluation, 'id' | 'createdAt'>): Promise<Evaluation>;
  listEvaluations(interviewId: string): Promise<Evaluation[]>;
  recordAudit(entry: Omit<AuditEntry, 'id' | 'createdAt'>): Promise<void>;
  listAudit(): Promise<AuditEntry[]>;
  getIdempotentResponse(key: string): Promise<unknown | null>;
  saveIdempotentResponse(key: string, response: unknown): Promise<void>;
  close(): Promise<void>;
}

export class DuplicateError extends Error {}
export class ConflictError extends Error {}
export class NotFoundError extends Error {}
