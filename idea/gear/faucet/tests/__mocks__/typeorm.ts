import { FaucetRequest, UserLastSeen } from '../../src/database';
import { repos } from './db';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');

  class FakeDataSource {
    initialize = jest.fn(async () => this);
    getRepository = jest.fn((entity: any) => {
      if (entity == FaucetRequest) {
        return repos.FaucetRequest;
      }
      if (entity == UserLastSeen) {
        return repos.UserLastSeen;
      }
      throw new Error('Unknown entity');
    });
  }

  return {
    ...actual,
    DataSource: FakeDataSource,
  };
});
