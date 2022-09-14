import { KeyringPair } from '@polkadot/keyring/types';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GearApi, DebugMode } from '../src';
import { getAccount, sendTransaction, sleep } from './utilsFunctions';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const api = new GearApi({ throwOnConnect: true });
let alice: KeyringPair;

beforeAll(async () => {
  await api.isReadyOrError;
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
    expect(transactionData[0]).toBeTruthy();
  });

  test('get snapshots', async () => {
    const snapshots: any[] = [];
    const unsub = debug.snapshots((event) => {
      snapshots.push(event.data);
    });
    const { programId } = api.program.upload({
      code: readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_ping.opt.wasm')),
      gasLimit: 2_000_000_000,
    });
    await sendTransaction(api.program.extrinsic, alice, 'MessageEnqueued');
    api.message.send({ destination: programId, payload: 'PING', gasLimit: 2_000_000_000 });
    await sendTransaction(api.message.extrinsic, alice, 'MessageEnqueued');
    (await unsub)();
    expect(snapshots).toHaveLength(2);
    for (const snapshot of snapshots) {
      expect(snapshot[0]).toHaveProperty('dispatchQueue');
      expect(snapshot[0]).toHaveProperty('programs');
    }
    expect(snapshots[0][0].programs).toHaveLength(1);
    expect(snapshots[0][0].programs[0]).toHaveProperty('state');
    expect(snapshots[0][0].programs[0].state.isActive).toBeTruthy();
    for (const prop of ['codeHash', 'persistentPages', 'staticPages']) {
      expect(snapshots[0][0].programs[0].state.asActive).toHaveProperty(prop);
    }
  });

  test('disable debug mode', async () => {
    debug.disable();
    const transactionData = await sendTransaction(debug.enabled, alice, 'DebugMode');
    expect(transactionData[0]).toBeFalsy();
  });
});
