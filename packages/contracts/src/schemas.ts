import { z } from 'zod';

export const roles = ['admin', 'recruiter', 'reviewer', 'candidate'] as const;
export const RoleSchema = z.enum(roles);
export type Role = z.infer<typeof RoleSchema>;

export const interviewStatuses = ['scheduled', 'invited', 'in_progress', 'completed', 'cancelled'] as const;
export const InterviewStatusSchema = z.enum(interviewStatuses);
export type InterviewStatus = z.infer<typeof InterviewStatusSchema>;

export function normalizeEmail(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase('en-US');
}

export const EmailSchema = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .email()
  .transform(normalizeEmail);

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8).max(128),
});

export const CandidateInputSchema = z.object({
  email: EmailSchema,
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(2_000).optional(),
});
export type CandidateInput = z.input<typeof CandidateInputSchema>;

export const CandidateSchema = CandidateInputSchema.extend({
  id: z.string().uuid(),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Candidate = z.output<typeof CandidateSchema>;

export const ProjectInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1_000).optional(),
});

export const InterviewInputSchema = z.object({
  candidateId: z.string().uuid(),
  projectId: z.string().uuid(),
  reviewerId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
});

export const EvaluationInputSchema = z.object({
  interviewId: z.string().uuid(),
  score: z.number().min(0).max(5),
  recommendation: z.enum(['strong_no', 'no', 'yes', 'strong_yes']),
  notes: z.string().trim().min(1).max(4_000),
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(120).default(''),
});

export function pageOffset(page: number, pageSize: number): number {
  return Math.max(0, (page - 1) * pageSize);
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: unknown;
  };
}
