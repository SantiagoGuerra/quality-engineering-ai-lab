import type { AuthenticatedUser, Candidate, CandidateInput } from '@talent-lab/contracts';

export interface Session { token: string; user: AuthenticatedUser; expiresInSeconds: number }
export interface CandidatePage { items: Candidate[]; page: number; pageSize: number; total: number }
export interface Project { id: string; name: string; description?: string; createdAt: string }

export class ApiClientError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...init.headers },
    });
  } catch {
    throw new ApiClientError(0, 'NETWORK_ERROR', 'The API is temporarily unreachable. Check your connection and try again.');
  }
  const body = response.status === 204 ? undefined : await response.json().catch(() => undefined) as unknown;
  if (!response.ok) {
    const error = (body as { error?: { code?: string; message?: string } } | undefined)?.error;
    if (response.status === 401 && token) window.dispatchEvent(new CustomEvent('talent:session-expired'));
    throw new ApiClientError(response.status, error?.code ?? 'HTTP_ERROR', error?.message ?? `Request failed (${response.status})`);
  }
  return body as T;
}

export const api = {
  login: (email: string, password: string) => request<Session>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: (token: string) => request<{ status: string }>('/auth/logout', { method: 'POST' }, token),
  candidates: (token: string, page: number, q: string) => request<CandidatePage>(`/candidates?page=${page}&pageSize=10&q=${encodeURIComponent(q)}`, {}, token),
  createCandidate: (token: string, input: CandidateInput, idempotencyKey: string) => request<Candidate>('/candidates', { method: 'POST', headers: { 'idempotency-key': idempotencyKey }, body: JSON.stringify(input) }, token),
  projects: (token: string) => request<Project[]>('/projects', {}, token),
  createProject: (token: string, input: { name: string; description?: string }) => request<Project>('/projects', { method: 'POST', body: JSON.stringify(input) }, token),
  createInterview: (token: string, input: { candidateId: string; projectId: string; reviewerId: string; scheduledAt: string }) => request<{ id: string }>('/interviews', { method: 'POST', body: JSON.stringify(input) }, token),
  invite: (token: string, interviewId: string) => request<{ status: string }>(`/interviews/${interviewId}/invite`, { method: 'POST' }, token),
};
