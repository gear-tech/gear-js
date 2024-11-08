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
    const testArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * (100 - 0 + 1)) + 0);

    for (const builtinId of testArray) {
      const id = await api.builtin.queryId(api.createType('u64', new BN(builtinId)));
      expect(id.length).toBe(66);
    }
  });
});
