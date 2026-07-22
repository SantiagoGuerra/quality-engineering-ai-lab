import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GenericContainer, Wait, type StartedTestContainer } from 'testcontainers';
import { migrate, PgTalentRepository, seedDatabase } from '@talent-lab/database';

describe('PostgreSQL integration', () => {
  let container: StartedTestContainer; let repository: PgTalentRepository;
  beforeAll(async () => {
    container = await new GenericContainer('postgres:16.9-alpine3.22').withEnvironment({ POSTGRES_DB: 'talent_lab', POSTGRES_USER: 'talent', POSTGRES_PASSWORD: 'talent_local' }).withExposedPorts(5432).withWaitStrategy(Wait.forLogMessage(/database system is ready to accept connections/, 2)).start();
    repository = new PgTalentRepository(`postgres://talent:talent_local@${container.getHost()}:${container.getMappedPort(5432)}/talent_lab`);
    await migrate(repository.pool); await seedDatabase(repository.pool, 'candidate-creation');
  });
  afterAll(async () => { if (repository) await repository.close(); if (container) await container.stop(); });

  it('persists, queries, updates and cleans real candidate data', async () => {
    const created = await repository.createCandidate({ email: 'integration@example.test', firstName: 'Integration', lastName: 'Test', notes: 'Synthetic only' });
    expect((await repository.getCandidate(created.id))?.email).toBe('integration@example.test');
    const updated = await repository.updateCandidate(created.id, created.version, { email: created.email, firstName: 'Updated', lastName: created.lastName });
    expect(updated.version).toBe(2); expect((await repository.listCandidates(1, 10, 'updated')).total).toBe(1);
    await repository.pool.query('DELETE FROM candidates WHERE id=$1', [created.id]); expect(await repository.getCandidate(created.id)).toBeNull();
  });
});
