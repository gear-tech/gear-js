import { GearApi } from '../src';
import { KeyringPair } from '@polkadot/keyring/types';
import { RegistryError } from '@polkadot/types-codec/types';
import { getAccount, sleep } from './utilsFunctions';

let api: GearApi;
let alice: KeyringPair;

beforeAll(async () => {
  api = await GearApi.create();
  [alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Get extrinsic errors', () => {
  test('send incorrect transaction', async () => {
    const submitted = api.tx.gear.uploadProgram('0x123456', '0x123', '0x00', 1000, 0);
    const error: RegistryError = await new Promise((resolve) => {
      submitted.signAndSend(alice, ({ events = [] }) => {
        events.forEach(({ event }) => {
          if (api.events.system.ExtrinsicFailed.is(event)) {
            resolve(api.getExtrinsicFailedError(event));
          }
        });
      });
    });
    expect(error.docs.join(' ')).toBe('Failed to create a program.');
    expect(error.method).toBe('FailedToConstructProgram');
    expect(error.name).toBe('FailedToConstructProgram');
  });
});
