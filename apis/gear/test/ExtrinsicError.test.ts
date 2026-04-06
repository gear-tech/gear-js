import type { KeyringPair } from '@polkadot/keyring/types';

import type { ExtrinsicFailedData } from '../src';
import { getApi } from './common';
import { getAccount, sleep } from './utilsFunctions';

const api = getApi();
let alice: KeyringPair;

beforeAll(async () => {
  await api.isReadyOrError;
  alice = await getAccount('//Alice');
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Get extrinsic errors', () => {
  test('send incorrect transaction', async () => {
    const submitted = api.tx.gear.uploadProgram('0x123456', '0x123', '0x00', 1000, 0, true);
    const error = await new Promise<ExtrinsicFailedData>((resolve) => {
      submitted.signAndSend(alice, ({ events = [] }) => {
        events.forEach(({ event }) => {
          if (api.events.system.ExtrinsicFailed.is(event)) {
            resolve(api.getExtrinsicFailedError(event));
          }
        });
      });
    });
    expect(error.docs).toBe('Failed to create a program.');
    expect(error.method).toBe('ProgramConstructionFailed');
    expect(error.name).toBe('ProgramConstructionFailed');
  });
});
