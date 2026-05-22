import { vi } from 'vitest';

import { FaucetRequest, UserLastSeen } from '../../src/database/index.js';
import { repos } from './db.js';

vi.mock('typeorm', async () => {
  const actual = await vi.importActual('typeorm');

  class FakeDataSource {
    initialize = vi.fn(async () => this);
    getRepository = vi.fn((entity: any) => {
      if (entity === FaucetRequest) {
        return repos.FaucetRequest;
      }
      if (entity === UserLastSeen) {
        return repos.UserLastSeen;
      }
      throw new Error('Unknown entity');
    });
  }

  return {
    ...(actual as object),
    DataSource: FakeDataSource,
  };
});
