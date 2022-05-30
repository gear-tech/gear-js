import { GearApi, Hex } from '../src';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { readFileSync } from 'fs';
import { TEST_WASM_DIR } from './config';
import { join } from 'path';
import { KeyringPair } from '@polkadot/keyring/types';

const api = new GearApi();

const CODE_PATH = join(TEST_WASM_DIR, 'test_waitlist.opt.wasm');
let alice: KeyringPair = undefined;
let programId: Hex = undefined;

beforeAll(async () => {
  await api.isReady;
  const code = readFileSync(CODE_PATH);
  alice = (await getAccount())[0];
  programId = api.program.submit({ code, gasLimit: 2_000_000_000 }).programId;
  const init = checkInit(api, programId);
  await sendTransaction(api.program, alice, 'InitMessageEnqueued');
  expect(await init).toBe('success');
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('GearWaitlist', () => {
  test('test', async () => {
    api.message.submit({ destination: programId, payload: '0x00', gasLimit: 2_000_000_000 });
    const { messageId } = await sendTransaction(api.message, alice, 'DispatchMessageEnqueued');
    const waitlist = await api.waitlist.read(programId);
    console.log(JSON.stringify(waitlist, undefined, 4));
    expect(waitlist).toHaveLength(1);
    expect(waitlist[0][0][0]).toBe(programId);
    expect(waitlist[0][0][1]).toBe(messageId);
    expect(waitlist[0][1]).toHaveProperty('kind');
    expect(waitlist[0][1]).toHaveProperty('message');
    expect(waitlist[0][1]).toHaveProperty('context');
  });
});
