import { HexString } from '@polkadot/util/types';
import { bufferToU8a } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { join } from 'path';
import { readFileSync } from 'fs';
import { u64 } from '@polkadot/types-codec';

import { TARGET, TEST_META } from './config';
import { ProgramMetadata } from '../src';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { GasInfo } from '../src/types';
import { decodeAddress } from '../src/utils';
import { getApi } from './common';

const api = getApi();
let alice: KeyringPair;
let aliceRaw: HexString;
let programId: HexString;
let codeId: HexString;
let messageId: HexString;

const code = Uint8Array.from(readFileSync(join(TARGET, 'test_meta.opt.wasm')));
const meta = ProgramMetadata.from(`0x${readFileSync(TEST_META, 'utf-8')}`);

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

describe('Calculate gas', () => {
  test('Get init gas spent (upload)', async () => {
    const gas: GasInfo = await api.program.calculateGas.initUpload(aliceRaw, code, [1, 2, 3], 0, true, meta);
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
    const program = api.program.upload({ code, gasLimit: gasLimits.init as u64, initPayload: [1, 2, 3] }, meta);
    programId = program.programId;
    codeId = program.codeId;
    const initStatus = checkInit(api, programId);
    await sendTransaction(program.extrinsic, alice, ['MessageQueued']);
    expect(await initStatus).toBe('success');
  });

  test('Get init gas spent (create)', async () => {
    const gas: GasInfo = await api.program.calculateGas.initCreate(aliceRaw, codeId, [1, 2, 3], 0, true, meta);
    expect(gas).toBeDefined();
    expect(gas.toHuman()).toHaveProperty('min_limit');
    expect(gas.min_limit.gtn(0)).toBeTruthy();
    gasLimits.init = gas.min_limit;
    expect(gas.toHuman()).toHaveProperty('burned');
    expect(gas.toHuman()).toHaveProperty('reserved');
    expect(gas.toHuman()).toHaveProperty('may_be_returned');
    expect(gasLimits.init.toHuman()).toBe(gas.min_limit.toHuman());
  });

  test('Create program', async () => {
    expect(gasLimits.init).toBeDefined();
    const program = api.program.create({ codeId, gasLimit: gasLimits.init as u64, initPayload: [1, 2, 3] }, meta);
    programId = program.programId;
    const initStatus = checkInit(api, programId);
    await sendTransaction(program.extrinsic, alice, ['MessageQueued']);
    expect(await initStatus).toBe('success');
  });

  test('Get handle gas spent', async () => {
    expect(programId).toBeDefined();
    const gas = await api.program.calculateGas.handle(
      aliceRaw,
      programId,
      { input: 'Handle' },
      10_000_000_000_000,
      true,
      meta,
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

  test('Send message', async () => {
    expect(gasLimits.handle).toBeDefined();
    const tx = await api.message.send(
      {
        destination: programId,
        payload: { Input: 'Handle' },
        gasLimit: (gasLimits.handle as u64).muln(2),
        value: 10_000_000_000_000,
      },
      meta,
    );
    const [_, blockHash] = await sendTransaction(tx, alice, ['MessageQueued']);

    const {
      data: { message },
    } = await api.message.getReplyEvent(programId, null, blockHash);

    expect(message.id).toBeDefined();
    messageId = message.id.toHex();
    expect(message.details).toBeDefined();
    expect(message.details.isNone).toBeTruthy();
  });

  test('Calculate reply gas', async () => {
    expect(messageId).toBeDefined();
    const gas = await api.program.calculateGas.reply(
      aliceRaw,
      messageId,
      { StructReply: { input: 'Reply' } },
      0,
      true,
      meta,
    );
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
    const tx = await api.message.sendReply(
      {
        replyToId: messageId,
        payload: { StructReply: { input: 'Reply' } },
        gasLimit: gasLimits.reply!,
      },
      meta,
    );
    const [data] = await sendTransaction(tx, alice, ['MessageQueued']);
    expect(data).toBeDefined();
  });
});
