import { GearApi, DebugMode } from '../src';
import { getAccount, sendTransaction, sleep } from './utilsFunctions';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TEST_WASM_DIR } from './config';
import { KeyringPair } from '@polkadot/keyring/types';

const api = new GearApi();
let alice: KeyringPair;

jest.setTimeout(15000);

beforeAll(async () => {
  await api.isReady;
  [alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('DebugMode', () => {
  const debug = new DebugMode(api);

  test('enable debug mode', async () => {
    debug.enable();
    const transactionData = await sendTransaction(debug.enabled, alice, 'DebugMode');
    expect(transactionData).toBe(true);
  });

  test('get snapshots', async () => {
    const snapshot = {
      promise: undefined,
      resolve: undefined,
    };
    snapshot.promise = new Promise((resolve) => {
      snapshot.resolve = resolve;
    });
    const unsub = debug.snapshots((event) => {
      snapshot.resolve(event.data);
    });
    api.program.submit({
      code: readFileSync(join(TEST_WASM_DIR, 'demo_ping.opt.wasm')),
      gasLimit: 50_000_000,
    });
    await sendTransaction(api.program.submitted, alice, 'InitMessageEnqueued');

    const snapshotData = await snapshot.promise;
    (await unsub)();
    expect(snapshotData[0]).toHaveProperty('dispatchQueue');
    expect(snapshotData[0]).toHaveProperty('programs');
  });

  test('disable debug mode', async () => {
    debug.disable();
    const transactionData = await sendTransaction(debug.enabled, alice, 'DebugMode');
    expect(transactionData).toBe(false);
  });
});
