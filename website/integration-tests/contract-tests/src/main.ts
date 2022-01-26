import { createConnection, getRepository } from 'typeorm';

import { Program } from './program-entities/program.entity';

describe('database', () => {
  it('should contain some records', async () => {
    await createConnection({ type: 'postgres', host: 'postgres', username: 'postgres', password: 'postgres' });
    const repo = getRepository(Program);
    const programsCount = await repo.count();

    expect(programsCount).toBeGreaterThan(0);
  });
});
