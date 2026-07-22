import { randomUUID } from 'node:crypto';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { CandidateInputSchema, EvaluationInputSchema, InterviewInputSchema, InterviewStatusSchema, LoginSchema, PaginationSchema, ProjectInputSchema, averageScore, can, type Action, type ApiErrorBody } from '@talent-lab/contracts';
import { ConflictError, DuplicateError, NotFoundError, PgTalentRepository, verifyPassword, type TalentRepository } from '@talent-lab/database';
import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { RecordingMailer, type InvitationMailer } from './mailer.js';

interface BuildOptions {
  repository?: TalentRepository;
  mailer?: InvitationMailer;
  jwtSecret?: string;
  enableTestFixtures?: boolean;
  logger?: boolean;
}

class HttpError extends Error {
  constructor(readonly statusCode: number, readonly code: string, message: string) { super(message); }
}

function errorBody(code: string, message: string, requestId?: string, details?: unknown): ApiErrorBody {
  return { error: { code, message, ...(requestId ? { requestId } : {}), ...(details === undefined ? {} : { details }) } };
}

export async function buildApp(options: BuildOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger ?? false, genReqId: () => randomUUID() });
  const repository = options.repository ?? new PgTalentRepository(process.env.DATABASE_URL ?? 'postgres://talent:talent_local@localhost:54329/talent_lab');
  const mailer = options.mailer ?? new RecordingMailer();

  await app.register(cors, { origin: process.env.WEB_ORIGIN ?? 'http://localhost:4173' });
  await app.register(jwt, { secret: options.jwtSecret ?? process.env.JWT_SECRET ?? 'local-only-change-me-32-characters-minimum' });
  await app.register(swagger, {
    openapi: {
      info: { title: 'Talent Lab API', version: '1.0.0', description: 'Local-only recruitment quality engineering demo' },
      servers: [{ url: process.env.API_BASE_URL ?? 'http://localhost:3001' }],
      components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
    },
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });

  const authenticate = async (request: FastifyRequest): Promise<void> => { await request.jwtVerify(); };
  const authorize = (action: Action) => async (request: FastifyRequest): Promise<void> => {
    await authenticate(request);
    if (!can(request.user.role, action)) throw new HttpError(403, 'FORBIDDEN', `Role '${request.user.role}' cannot perform '${action}'`);
  };

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) return reply.status(400).send(errorBody('VALIDATION_ERROR', 'Request validation failed', request.id, error.issues));
    if (error instanceof DuplicateError) return reply.status(409).send(errorBody('DUPLICATE', error.message, request.id));
    if (error instanceof ConflictError) return reply.status(409).send(errorBody('VERSION_CONFLICT', error.message, request.id));
    if (error instanceof NotFoundError) return reply.status(404).send(errorBody('NOT_FOUND', error.message, request.id));
    if (error instanceof HttpError) return reply.status(error.statusCode).send(errorBody(error.code, error.message, request.id));
    if (typeof error === 'object' && error !== null && 'statusCode' in error && error.statusCode === 401) return reply.status(401).send(errorBody('UNAUTHENTICATED', 'Session is missing or expired', request.id));
    if (typeof error === 'object' && error !== null && 'statusCode' in error && error.statusCode === 400) return reply.status(400).send(errorBody('VALIDATION_ERROR', 'Request validation failed', request.id));
    request.log.error({ err: error }, 'unhandled request error');
    return reply.status(500).send(errorBody('INTERNAL_ERROR', 'Unexpected server error', request.id));
  });

  app.addHook('onClose', async () => { await repository.close(); });

  app.get('/health', { schema: { tags: ['system'], response: { 200: { type: 'object', properties: { status: { type: 'string' }, service: { type: 'string' } } } } } }, async () => ({ status: 'ok', service: 'talent-api' }));
  app.get('/metrics', async (_request, reply) => reply.type('text/plain').send('talent_api_up 1\n'));
  app.get('/openapi.json', async () => app.swagger());

  app.post('/auth/login', { schema: { tags: ['auth'], body: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 } } } } }, async (request) => {
    const credentials = LoginSchema.parse(request.body);
    const user = await repository.getUserByEmail(credentials.email);
    if (!user || !verifyPassword(credentials.password, user.passwordHash)) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
    const publicUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    return { token: app.jwt.sign(publicUser, { expiresIn: '15m' }), user: publicUser, expiresInSeconds: 900 };
  });
  app.post('/auth/logout', { preHandler: authenticate }, async () => ({ status: 'logged_out' }));
  app.get('/auth/me', { preHandler: authenticate }, async (request) => request.user);

  app.get('/candidates', { preHandler: authorize('candidate:read') }, async (request) => {
    const query = PaginationSchema.parse(request.query);
    return repository.listCandidates(query.page, query.pageSize, query.q);
  });
  app.post('/candidates', { preHandler: authorize('candidate:write') }, async (request, reply) => {
    const input = CandidateInputSchema.parse(request.body);
    const key = request.headers['idempotency-key'];
    if (typeof key === 'string') {
      const saved = await repository.getIdempotentResponse(key);
      if (saved) return reply.header('x-idempotent-replay', 'true').send(saved);
    }
    const created = await repository.createCandidate(input);
    await repository.recordAudit({ actorId: request.user.id, action: 'candidate.created', entityType: 'candidate', entityId: created.id, metadata: { email: created.email } });
    if (typeof key === 'string') await repository.saveIdempotentResponse(key, created);
    return reply.status(201).send(created);
  });
  app.put('/candidates/:id', { preHandler: authorize('candidate:write') }, async (request) => {
    const input = CandidateInputSchema.parse(request.body);
    const { id } = request.params as { id: string };
    const expected = Number(request.headers['if-match']);
    if (!Number.isInteger(expected) || expected < 1) throw new HttpError(428, 'PRECONDITION_REQUIRED', 'If-Match must contain the candidate version');
    const updated = await repository.updateCandidate(id, expected, input);
    await repository.recordAudit({ actorId: request.user.id, action: 'candidate.updated', entityType: 'candidate', entityId: id, metadata: { version: updated.version } });
    return updated;
  });

  app.get('/projects', { preHandler: authenticate }, async () => repository.listProjects());
  app.post('/projects', { preHandler: authorize('project:write') }, async (request, reply) => {
    const input = ProjectInputSchema.parse(request.body);
    return reply.status(201).send(await repository.createProject({ name: input.name, ...(input.description ? { description: input.description } : {}) }));
  });
  app.post('/projects/:projectId/candidates/:candidateId', { preHandler: authorize('project:write') }, async (request, reply) => {
    const { projectId, candidateId } = request.params as { projectId: string; candidateId: string };
    await repository.associateCandidate(projectId, candidateId); return reply.status(204).send();
  });

  app.post('/interviews', { preHandler: authorize('interview:write') }, async (request, reply) => reply.status(201).send(await repository.createInterview(InterviewInputSchema.parse(request.body))));
  app.patch('/interviews/:id/status', { preHandler: authorize('interview:write') }, async (request) => {
    const { id } = request.params as { id: string };
    const body = request.body as { status?: unknown; version?: unknown };
    return repository.updateInterviewStatus(id, InterviewStatusSchema.parse(body.status), Number(body.version));
  });
  app.post('/interviews/:id/invite', { preHandler: authorize('interview:write') }, async (request) => {
    const { id } = request.params as { id: string };
    const item = await repository.getInterview(id);
    if (!item) throw new NotFoundError('interview not found');
    const candidate = await repository.getCandidate(item.candidateId);
    if (!candidate) throw new NotFoundError('candidate not found');
    await mailer.sendInvitation({ to: candidate.email, candidateName: `${candidate.firstName} ${candidate.lastName}`, interviewId: id });
    const updated = await repository.updateInterviewStatus(id, 'invited', item.version);
    return { status: 'sent', interview: updated };
  });

  app.post('/evaluations', { preHandler: authorize('evaluation:write') }, async (request, reply) => {
    const input = EvaluationInputSchema.parse(request.body);
    return reply.status(201).send(await repository.createEvaluation({ ...input, reviewerId: request.user.id }));
  });
  app.get('/interviews/:id/results', { preHandler: authorize('result:read') }, async (request) => {
    const { id } = request.params as { id: string };
    const evaluations = await repository.listEvaluations(id);
    return { interviewId: id, averageScore: averageScore(evaluations.map((item) => item.score)), evaluations };
  });
  app.get('/audit', { preHandler: authorize('audit:read') }, async () => repository.listAudit());

  if (options.enableTestFixtures ?? process.env.ENABLE_TEST_FIXTURES === 'true') {
    app.get('/__fixtures__/slow', { schema: { hide: true } }, async (request) => {
      const delay = Math.min(2_000, Number((request.query as { ms?: string }).ms ?? 500));
      await new Promise((resolve) => setTimeout(resolve, delay)); return { delayedMs: delay };
    });
    app.get('/__fixtures__/partial', { schema: { hide: true } }, async () => ({ status: 'partial', delivered: ['candidate'], failed: ['email'] }));
    app.get('/__fixtures__/database-error', { schema: { hide: true } }, async () => { throw new Error('simulated database error fixture'); });
  }

  await app.ready();
  return app;
}
