import { CreateType, GearApi, MessageWaitedData } from '../src';
import { Hex } from '../src/types';
import { checkInit, getAccount, listenToMessageWaited, sendTransaction, sleep } from './utilsFunctions';
import { readFileSync } from 'fs';
import { TARGET } from './config';
import { join } from 'path';
import { KeyringPair } from '@polkadot/keyring/types';

const api = new GearApi();

const CODE_PATH = join(TARGET, 'test_waitlist.opt.wasm');
let alice: KeyringPair;
let programId: Hex;
let messageId: Hex;
let messageWaited: (messageId: Hex) => Promise<MessageWaitedData>;

beforeAll(async () => {
  await api.isReadyOrError;
  const code = readFileSync(CODE_PATH);
  alice = (await getAccount())[0];
  programId = api.program.upload({ code, gasLimit: 2_000_000_000 }).programId;
  const init = checkInit(api, programId);
  await sendTransaction(api.program, alice, 'MessageEnqueued');
  expect(await init()).toBe('success');
  messageWaited = listenToMessageWaited(api);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('GearWaitlist', () => {
  test("read program's waitlist", async () => {
    api.message.send({ destination: programId, payload: '0x00', gasLimit: 2_000_000_000 });
    messageId = (await sendTransaction(api.message, alice, 'MessageEnqueued')).id;
    const eventData = await messageWaited(messageId);
    expect(eventData).toBeDefined();
    expect(eventData).toHaveProperty('reason');
    expect(eventData.reason.isRuntime).toBeTruthy();
    expect(eventData.reason.asRuntime.isWaitCalled).toBeTruthy();
    expect(eventData).toHaveProperty('expiration');
    expect(eventData).toHaveProperty('origin');
    const waitlist = await api.waitlist.read(programId);
    expect(waitlist).toHaveLength(1);
    expect(waitlist[0]).toHaveProperty('toHuman');
    expect(waitlist[0].toHuman()).toHaveLength(2);
    expect(waitlist[0][0]).toHaveProperty('kind');
    expect(waitlist[0][0]).toHaveProperty('message');
    expect(waitlist[0][0]).toHaveProperty('context');
    expect(waitlist[0][1]).toHaveProperty('start');
    expect(waitlist[0][1]).toHaveProperty('finish');
  });

  test("read program's waitlist with messageId", async () => {
    const waitlist = await api.waitlist.read(programId, messageId);
    expect(waitlist).toHaveLength(2);
    expect(waitlist[0]).toHaveProperty('kind');
    expect(waitlist[0]).toHaveProperty('message');
    expect(waitlist[0]).toHaveProperty('context');
    expect(waitlist[1]).toHaveProperty('start');
    expect(waitlist[1]).toHaveProperty('finish');
  });

  test("send one more message and read program's waitlist", async () => {
    api.message.send({ destination: programId, payload: '0x00', gasLimit: 2_000_000_000 });
    messageId = (await sendTransaction(api.message, alice, 'MessageEnqueued'))[0];
    const waitlist = await api.waitlist.read(programId);
    expect(waitlist).toHaveLength(2);
  });

  test('read waitlist of non-program address', async () => {
    const waitlist = await api.waitlist.read(CreateType.create('[u8;32]', 0).toHex());
    expect(waitlist).toHaveLength(0);
  });

  test("read program's waitlist with incorrect messageId", async () => {
    const waitlist = await api.waitlist.read(programId, CreateType.create('[u8;32]', 0).toHex());
    expect(waitlist).toBeNull();
  });
});
