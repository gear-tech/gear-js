import { createConnection } from 'typeorm';

describe('database', () => {
  it('should connect', async () => {
    const connection = await createConnection({ type: 'postgres', host: 'postgres', username: 'postgres', password: 'postgres' });

    expect(connection.isConnected).toBeTruthy();
  });
});
