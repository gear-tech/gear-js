import { KeyringPair } from '@polkadot/keyring/types';
import { u64 } from '@polkadot/types-codec';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GearApi } from '../src';
import { decodeAddress } from '../src/utils';
import { GasInfo, Hex } from '../src/types';
import { checkInit, getAccount, listenToUserMessageSent, sendTransaction, sleep } from './utilsFunctions';
import { TEST_WASM_DIR } from './config';

const api = new GearApi();
let alice: KeyringPair;
let aliceRaw: Hex;
let programId: Hex;
let codeId: Hex;
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
  aliceRaw = decodeAddress(alice.address);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Calculate gas', () => {
  test.only('Get init gas spent (upload)', async () => {
    const gas: GasInfo = await api.program.calculateGas.initUpload(aliceRaw, code, '0x00', 0, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.min_limit.gtn(0)).toBeTruthy();
    gasLimits.init = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gas.toHuman()).toHaveProperty('waited');
  });

  test('Upload program', async () => {
    expect(gasLimits.init).toBeDefined();
    const program = api.program.upload({ code, gasLimit: gasLimits.init as u64 });
    programId = program.programId;
    codeId = program.codeId;
    const initStatus = checkInit(api, programId);
    api.program.signAndSend(alice, () => {});
    expect(await initStatus()).toBe('success');
  });

  test.only('Get init gas spent (create)', async () => {
    const gas: GasInfo = await api.program.calculateGas.initCreate(aliceRaw, codeId, '0x00', 0, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.min_limit.gtn(0)).toBeTruthy();
    gasLimits.init = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gasLimits.init.toHuman()).toBe(gas.min_limit.toHuman());
  });

  test.only('Create program', async () => {
    expect(gasLimits.init).toBeDefined();
    api.program.create({ codeId, gasLimit: gasLimits.init as u64 });
    const initStatus = checkInit(api, programId);
    api.program.signAndSend(alice, () => {});
    expect(await initStatus()).toBe('success');
  });

  test('Get handle gas spent', async () => {
    expect(programId).toBeDefined();
    const gas = await api.program.calculateGas.handle(aliceRaw, programId, '0x50494e47', 1000, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.min_limit.gtn(0)).toBeTruthy();
    gasLimits.handle = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gas.toHuman()).toHaveProperty('waited');
  });

  test('Send message', async () => {
    expect(gasLimits.handle).toBeDefined();
    api.message.send({
      destination: programId,
      payload: '0x50494e47',
      gasLimit: (gasLimits.handle as u64).muln(2), // TODO remove `* 1.5` when expiration_block will work
      value: 1000,
    });
    const waitForReply = listenToUserMessageSent(api, programId);
    await sendTransaction(api.message, alice, 'MessageEnqueued');
    const { message } = await waitForReply(null);
    expect(message.id).toBeDefined();
    messageId = message.id.toHex();
    expect(message.reply).toBeDefined();
    expect(message.reply.isNone).toBeTruthy();
  });

  test('Get gas spent if payload is U8a', async () => {
    const payload = new Uint8Array([80, 73, 78, 71]);
    const gas = await api.program.calculateGas.handle(aliceRaw, programId, payload, 0, true);

    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.min_limit.gtn(0)).toBeTruthy();
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gas.toHuman()).toHaveProperty('waited');
  });

  test('Calculate reply gas', async () => {
    expect(messageId).toBeDefined();
    const gas = await api.program.calculateGas.reply(aliceRaw, messageId, exitCode, '0x00', 0, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    gasLimits.reply = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gas.toHuman()).toHaveProperty('waited');
  });

  test('Send reply', async () => {
    expect(gasLimits.reply).toBeDefined();
    const tx = api.message.sendReply({ replyToId: messageId, payload: '0x50494e47', gasLimit: gasLimits.reply as u64 });
    const data = await sendTransaction(tx, alice, 'MessageEnqueued');
    expect(data).toBeDefined();
  });
});
