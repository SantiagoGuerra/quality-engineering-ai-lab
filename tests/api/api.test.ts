import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { MemoryTalentRepository } from '@talent-lab/database';
import { buildApp } from '../../apps/api/src/app.js';
import { RecordingMailer } from '../../apps/api/src/mailer.js';

describe('Talent API', () => {
  let app: FastifyInstance; let repository: MemoryTalentRepository; let mailer: RecordingMailer;
  beforeEach(async () => { repository = new MemoryTalentRepository(); mailer = new RecordingMailer(); app = await buildApp({ repository, mailer, jwtSecret: 'test-secret-that-is-long-enough' }); });
  afterEach(async () => { await app.close(); });

  async function login(email = 'recruiter@talent.test'): Promise<string> {
    const response = await app.inject({ method: 'POST', url: '/auth/login', payload: { email, password: 'QaDemo!2026' } });
    expect(response.statusCode).toBe(200); return response.json<{ token: string }>().token;
  }

  it('publishes health and OpenAPI without authentication', async () => {
    expect((await app.inject({ url: '/health' })).json()).toEqual({ status: 'ok', service: 'talent-api' });
    const openapi = (await app.inject({ url: '/openapi.json' })).json<{ info: { title: string } }>();
    expect(openapi.info.title).toBe('Talent Lab API');
  });

  it('rejects bad login and missing/expired sessions', async () => {
    expect((await app.inject({ method: 'POST', url: '/auth/login', payload: { email: 'recruiter@talent.test', password: 'not-correct' } })).statusCode).toBe(401);
    const malformed = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: '0@a.com', password: 'short' } });
    expect(malformed.statusCode).toBe(400); expect(malformed.json().error.code).toBe('VALIDATION_ERROR');
    const response = await app.inject({ url: '/candidates' });
    expect(response.statusCode).toBe(401); expect(response.json().error.code).toBe('UNAUTHENTICATED');
  });

  it('rate limits repeated login attempts with a stable API error', async () => {
    let response = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: 'recruiter@talent.test', password: 'not-correct' } });
    for (let attempt = 1; attempt <= 10; attempt += 1) {
      response = await app.inject({ method: 'POST', url: '/auth/login', payload: { email: 'recruiter@talent.test', password: 'not-correct' } });
    }
    expect(response.statusCode).toBe(429);
    expect(response.json().error.code).toBe('RATE_LIMITED');
  });

  it('creates, lists and idempotently replays a candidate', async () => {
    const token = await login(); const payload = { email: 'new.person@example.test', firstName: 'New', lastName: 'Person', location: 'Remote' };
    const first = await app.inject({ method: 'POST', url: '/candidates', headers: { authorization: `Bearer ${token}`, 'idempotency-key': 'candidate-001' }, payload });
    const replay = await app.inject({ method: 'POST', url: '/candidates', headers: { authorization: `Bearer ${token}`, 'idempotency-key': 'candidate-001' }, payload });
    expect(first.statusCode).toBe(201); expect(replay.statusCode).toBe(200); expect(replay.headers['x-idempotent-replay']).toBe('true'); expect(replay.json().id).toBe(first.json().id);
    const list = await app.inject({ url: '/candidates?page=1&pageSize=10&q=new', headers: { authorization: `Bearer ${token}` } });
    expect(list.json().total).toBe(1); expect(repository.audits).toHaveLength(1);
  });

  it('returns duplicate, validation and optimistic conflict errors', async () => {
    const token = await login(); const payload = { email: 'duplicate@example.test', firstName: 'Dupe', lastName: 'Person' };
    const created = await app.inject({ method: 'POST', url: '/candidates', headers: { authorization: `Bearer ${token}` }, payload });
    expect((await app.inject({ method: 'POST', url: '/candidates', headers: { authorization: `Bearer ${token}` }, payload })).statusCode).toBe(409);
    expect((await app.inject({ method: 'POST', url: '/candidates', headers: { authorization: `Bearer ${token}` }, payload: { email: 'bad' } })).statusCode).toBe(400);
    expect((await app.inject({ method: 'PUT', url: `/candidates/${created.json().id}`, headers: { authorization: `Bearer ${token}`, 'if-match': '99' }, payload })).json().error.code).toBe('VERSION_CONFLICT');
  });

  it('denies recruiter-only writes to reviewer and candidate roles', async () => {
    for (const email of ['reviewer@talent.test', 'candidate@talent.test']) {
      const token = await login(email);
      const response = await app.inject({ method: 'POST', url: '/candidates', headers: { authorization: `Bearer ${token}` }, payload: { email: `${email}.new`, firstName: 'No', lastName: 'Access' } });
      expect(response.statusCode).toBe(403); expect(response.json().error.code).toBe('FORBIDDEN');
    }
  });

  it('sends a synthetic invitation and transitions interview state', async () => {
    const token = await login(); const candidate = await repository.createCandidate({ email: 'invitee@example.test', firstName: 'Invitee', lastName: 'Person' });
    const project = await repository.createProject({ name: 'QE role' });
    const created = await app.inject({ method: 'POST', url: '/interviews', headers: { authorization: `Bearer ${token}` }, payload: { candidateId: candidate.id, projectId: project.id, reviewerId: repository.users[2]!.id, scheduledAt: new Date(Date.now() + 86_400_000).toISOString() } });
    const invited = await app.inject({ method: 'POST', url: `/interviews/${created.json().id}/invite`, headers: { authorization: `Bearer ${token}` } });
    expect(invited.json().status).toBe('sent'); expect(mailer.messages).toEqual([expect.objectContaining({ to: 'invitee@example.test' })]);
  });
});
