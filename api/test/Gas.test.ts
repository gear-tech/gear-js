import { readFileSync } from 'fs';
import { KeyringPair } from '@polkadot/keyring/types';
import { join } from 'path';
import { GearApi, GearKeyring, Hex } from '../src';
import { TEST_WASM_DIR } from './config';
import { checkInit, getAccount, listenToUserMessageSent, sendTransaction, sleep } from './utilsFunctions';
import { GasInfo } from '../src/types/gear-core';
import { u64 } from '@polkadot/types-codec';

const api = new GearApi();
let alice: KeyringPair;
let aliceRaw: Hex;
let programId: Hex;
let messageId: Hex;
let exitCode: number;
const code = readFileSync(join(TEST_WASM_DIR, 'test_gas.opt.wasm'));
const gasLimits: { init: u64 | undefined; handle: u64 | undefined; reply: u64 | undefined } = {
  init: undefined,
  handle: undefined,
  reply: undefined,
};
beforeAll(async () => {
  await api.isReady;
  [alice] = await getAccount();
  aliceRaw = GearKeyring.decodeAddress(alice.address);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Calculate gas', () => {
  test('Get init gas spent', async () => {
    const gas: GasInfo = await api.program.calculateGas.init(aliceRaw, code, '0x00', 0, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    gasLimits.init = gas.min_limit;
    expect(gasLimits.init.toHuman()).toBe(gas.min_limit.toHuman());
  });

  test('Submit program', async () => {
    expect(gasLimits.init).toBeDefined();
    programId = api.program.submit({ code, gasLimit: gasLimits.init as u64 }).programId;
    const initStatus = checkInit(api, programId);
    api.program.signAndSend(alice, () => {});
    expect(await initStatus()).toBe('success');
  });

  test('Get handle gas spent', async () => {
    expect(programId).toBeDefined();
    const gas = await api.program.calculateGas.handle(aliceRaw, programId, '0x50494e47', 1000, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    gasLimits.handle = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
  });

  test('Send message', async () => {
    expect(gasLimits.handle).toBeDefined();
    api.message.submit({
      destination: programId,
      payload: '0x50494e47',
      gasLimit: (gasLimits.handle as u64).muln(2), // TODO remove `* 1.5` when expiration_block will work
      value: 1000,
    });
    const waitForReply = listenToUserMessageSent(api, programId);
    await sendTransaction(api.message, alice, 'MessageEnqueued');
    const { message } = await waitForReply(null); //transactionData[0]);
    expect(message.id).toBeDefined();
    messageId = message.id.toHex();
    expect(message.reply).toBeDefined();
    expect(message.reply.isNone).toBeTruthy();
    exitCode = 0; //umsData.reply.unwrap()[1].toNumber();
    expect(exitCode).toBeDefined();
  });

  test('Get gas spent if payload is U8a', async () => {
    const payload = new Uint8Array([80, 73, 78, 71]);
    const gas = await api.program.calculateGas.handle(aliceRaw, programId, payload, 0, true);

    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
  });

  test('Calculate reply gas', async () => {
    expect(messageId).toBeDefined();
    const gas = await api.program.calculateGas.reply(aliceRaw, messageId, exitCode, '0x00', 0, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    gasLimits.reply = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
  });

  test('Send reply', async () => {
    expect(gasLimits.reply).toBeDefined();
    api.reply.submit({ replyToId: messageId, payload: '0x50494e47', gasLimit: gasLimits.reply as u64 });
    const data = await sendTransaction(api.reply, alice, 'MessageEnqueued');
    expect(data).toBeDefined();
  });
});
