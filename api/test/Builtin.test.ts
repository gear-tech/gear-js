import { GearApi } from '../src';
import { sleep } from './utilsFunctions';
import { WS_ADDRESS } from './config';
import { BN } from '@polkadot/util';

const api = new GearApi({ providerAddress: WS_ADDRESS });

beforeAll(async () => {
  await api.isReadyOrError;
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Query id', () => {
  test('Random query id', async () => {
    const builtinId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    const id = await api.builtin.queryId(builtinId);
    expect(id.length).toBe(66);
  });
});
