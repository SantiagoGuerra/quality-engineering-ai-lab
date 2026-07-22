import process from 'node:process';
import { migrate, PgTalentRepository } from '@talent-lab/database';
import { buildApp } from './app.js';
import { SmtpInvitationMailer } from './mailer.js';

const port = Number(process.env.API_PORT ?? 3001);
const databaseUrl = process.env.DATABASE_URL ?? 'postgres://talent:talent_local@localhost:54329/talent_lab';
const repository = new PgTalentRepository(databaseUrl);
const enableTestFixtures = process.env.ENABLE_TEST_FIXTURES === 'true';
await migrate(repository.pool);
const app = await buildApp({
  repository,
  mailer: new SmtpInvitationMailer(process.env.SMTP_HOST ?? 'localhost', Number(process.env.SMTP_PORT ?? 10259)),
  enableTestFixtures,
  ...(enableTestFixtures ? { loginRateLimitMax: 100 } : {}),
  logger: true,
});

const shutdown = async (): Promise<void> => { await app.close(); process.exit(0); };
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
await app.listen({ host: '0.0.0.0', port });
