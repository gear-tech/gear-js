import { CreateType, GearApi, Hex, WaitlistItem } from '../src';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { readFileSync } from 'fs';
import { TEST_WASM_DIR } from './config';
import { join } from 'path';
import { KeyringPair } from '@polkadot/keyring/types';

const api = new GearApi();

const CODE_PATH = join(TEST_WASM_DIR, 'test_waitlist.opt.wasm');
let alice: KeyringPair = undefined;
let programId: Hex = undefined;
let messageId: Hex = undefined;

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
  test(`read program's waitlist`, async () => {
    api.message.submit({ destination: programId, payload: '0x00', gasLimit: 2_000_000_000 });
    messageId = (await sendTransaction(api.message, alice, 'DispatchMessageEnqueued')).messageId;
    const waitlist = await api.waitlist.read(programId);
    expect(waitlist).toHaveLength(1);
    expect(waitlist[0].programId).toBe(programId);
    expect(waitlist[0].messageId).toBe(messageId);
    expect(waitlist[0].blockNumber).toBeDefined();
    expect(waitlist[0].storedDispatch).toHaveProperty('kind');
    expect(waitlist[0].storedDispatch).toHaveProperty('message');
    expect(waitlist[0].storedDispatch).toHaveProperty('context');
  });

  test(`read program's waitlist with messageId`, async () => {
    const waitlist = await api.waitlist.read(programId, messageId);
    expect(waitlist).toHaveProperty('blockNumber');
    expect(waitlist).toHaveProperty('storedDispatch');
    expect(waitlist.storedDispatch).toHaveProperty('kind');
    expect(waitlist.storedDispatch).toHaveProperty('message');
    expect(waitlist.storedDispatch).toHaveProperty('context');
  });

  test(`send one more message and read program's waitlist`, async () => {
    api.message.submit({ destination: programId, payload: '0x00', gasLimit: 2_000_000_000 });
    messageId = (await sendTransaction(api.message, alice, 'DispatchMessageEnqueued')).messageId;
    const waitlist = await api.waitlist.read(programId);
    expect(waitlist).toHaveLength(2);
  });

  test(`read waitlist of non-program address`, async () => {
    const waitlist = await api.waitlist.read(CreateType.create('[u8;32]', 0).toHex());
    expect(waitlist).toHaveLength(0);
  });

  test(`read program's waitlist with incorrect messageId`, async () => {
    const waitlist = await api.waitlist.read(programId, CreateType.create('[u8;32]', 0).toHex());
    expect(waitlist).toBeNull();
  });
});
