import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { u64 } from '@polkadot/types-codec';
import { compactAddLength, stringToU8a, u8aConcat } from '@polkadot/util';
import { readFileSync } from 'fs';

import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { GasInfo } from '../src/types';
import { decodeAddress } from '../src/utils';
import { getApi } from './common';
import { TEST_CODE } from './config';

const api = getApi();
let alice: KeyringPair;
let aliceRaw: HexString;
let programId: HexString;
let codeId: HexString;
let messageId: HexString;

const code = Uint8Array.from(readFileSync(TEST_CODE));

const gasLimits: { init?: u64; handle?: u64; reply?: u64 } = {
  init: undefined,
  handle: undefined,
  reply: undefined,
};

beforeAll(async () => {
  await api.isReadyOrError;
  alice = await getAccount('//Alice');
  aliceRaw = decodeAddress(alice.address);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

const initPayload = compactAddLength(new Uint8Array([1, 2, 3]));
const payloadInputHandle = u8aConcat(new Uint8Array([2]), compactAddLength(stringToU8a('Handle')));
const payloadInputReply = u8aConcat(new Uint8Array([2]), compactAddLength(stringToU8a('Reply')));

describe('Calculate gas', () => {
  test('[calculateGas] init on upload', async () => {
    const gas: GasInfo = await api.program.calculateGas.initUpload(aliceRaw, code, initPayload, 0, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.min_limit.gtn(0)).toBeTruthy();
    gasLimits.init = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gas.toHuman()).toHaveProperty('waited');
  });

  test('[tx] upload program', async () => {
    expect(gasLimits.init).toBeDefined();
    const program = api.program.upload({ code, gasLimit: gasLimits.init as u64, initPayload });
    programId = program.programId;
    codeId = program.codeId;
    const initStatus = checkInit(api, programId);
    await sendTransaction(program.extrinsic, alice, ['MessageQueued']);
    expect(await initStatus).toBe('success');
  });

  test('[calculateGas] init on create', async () => {
    const gas: GasInfo = await api.program.calculateGas.initCreate(aliceRaw, codeId, initPayload, 0, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.min_limit.gtn(0)).toBeTruthy();
    gasLimits.init = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gasLimits.init.toHuman()).toBe(gas.min_limit.toHuman());
  });

  test('[tx] create program', async () => {
    expect(gasLimits.init).toBeDefined();
    const program = api.program.create({ codeId, gasLimit: gasLimits.init as u64, initPayload });
    programId = program.programId;
    const initStatus = checkInit(api, programId);
    await sendTransaction(program.extrinsic, alice, ['MessageQueued']);
    expect(await initStatus).toBe('success');
  });

  test('[calculateGas] handle', async () => {
    expect(programId).toBeDefined();
    const gas = await api.program.calculateGas.handle(
      aliceRaw,
      programId,
      payloadInputHandle,
      10_000_000_000_000,
      true,
    );
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.min_limit.gtn(0)).toBeTruthy();
    gasLimits.handle = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gas.toHuman()).toHaveProperty('waited');
  });

  test('[calculateGas] handle with big value', async () => {
    expect(programId).toBeDefined();
    const gas = await api.program.calculateGas.handle(
      aliceRaw,
      programId,
      payloadInputHandle,
      BigInt(10_000 * 1e12),
      true,
    );

    expect(gas).toBeDefined();
  });

  test('[tx] send message', async () => {
    expect(gasLimits.handle).toBeDefined();
    const tx = api.message.send({
      destination: programId,
      payload: payloadInputHandle,
      gasLimit: (gasLimits.handle as u64).muln(2),
      value: 10_000_000_000_000,
    });

    const [_, blockHash] = await sendTransaction(tx, alice, ['MessageQueued']);

    const {
      data: { message },
    } = await api.message.getReplyEvent(programId, null, blockHash);

    expect(message.id).toBeDefined();
    messageId = message.id.toHex();
    expect(message.details).toBeDefined();
    expect(message.details.isNone).toBeTruthy();
  });

  test('[calculateGas] reply', async () => {
    expect(messageId).toBeDefined();
    const gas = await api.program.calculateGas.reply(aliceRaw, messageId, payloadInputReply, 0, true);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    gasLimits.reply = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gas.toHuman()).toHaveProperty('waited');
  });

  test('[tx] reply', async () => {
    expect(gasLimits.reply).toBeDefined();
    const tx = await api.message.sendReply({
      replyToId: messageId,
      payload: payloadInputReply,
      gasLimit: gasLimits.reply!,
    });
    const [data] = await sendTransaction(tx, alice, ['MessageQueued']);
    expect(data).toBeDefined();
  });
});
