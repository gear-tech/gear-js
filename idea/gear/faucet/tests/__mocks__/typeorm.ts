import { vi } from 'vitest';

import {
  FaucetRequest,
  MainnetChallenge,
  MainnetClaim,
  MainnetClaimEvent,
  UserLastSeen,
} from '../../src/database/index.js';
import { repos } from './db.js';

vi.mock('typeorm', async () => {
  const actual = await vi.importActual('typeorm');

  class FakeDataSource {
    initialize = vi.fn(async () => this);
    query = vi.fn(async () => []);
    transaction = vi.fn(async (callback) => callback(this));
    getRepository = vi.fn((entity: any) => {
      if (entity === FaucetRequest) {
        return repos.FaucetRequest;
      }
      if (entity === MainnetChallenge) {
        return repos.MainnetChallenge;
      }
      if (entity === MainnetClaim) {
        return repos.MainnetClaim;
      }
      if (entity === MainnetClaimEvent) {
        return repos.MainnetClaimEvent;
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
