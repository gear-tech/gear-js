import { GearApi, DebugMode, ProgramState } from '../src';
import { getAccount, sendTransaction, sleep } from './utilsFunctions';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GEAR_EXAMPLES_WASM_DIR } from './config';
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
    const snapshots = [];
    const unsub = debug.snapshots((event) => {
      snapshots.push(event.data);
    });
    const { programId } = api.program.submit({
      code: readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_ping.opt.wasm')),
      gasLimit: 50_000_000,
    });
    await sendTransaction(api.program.submitted, alice, 'InitMessageEnqueued');
    api.message.submit({ destination: programId, payload: 'PING', gasLimit: 200_000_000 });
    await sendTransaction(api.message.submitted, alice, 'DispatchMessageEnqueued');
    (await unsub)();
    expect(snapshots).toHaveLength(2);
    for (let snapshot of snapshots) {
      expect(snapshot[0]).toHaveProperty('dispatchQueue');
      expect(snapshot[0]).toHaveProperty('programs');
    }
    expect(snapshots[0][0].programs).toHaveLength(1);
    expect(snapshots[0][0].programs[0]).toHaveProperty('state');
    expect(snapshots[0][0].programs[0].state.isActive).toBeTruthy();
    for (let prop of ['codeHash', 'persistentPages', 'staticPages']) {
      expect(snapshots[0][0].programs[0].state.asActive).toHaveProperty(prop);
    }
  });

  test('disable debug mode', async () => {
    debug.disable();
    const transactionData = await sendTransaction(debug.enabled, alice, 'DebugMode');
    expect(transactionData).toBe(false);
  });
});
