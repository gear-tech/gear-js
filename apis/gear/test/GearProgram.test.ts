import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { readFileSync } from 'fs';

import { TEST_CODE } from './config';
import { checkInit, createPayload, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { getApi } from './common';
import { Program } from '../src';

const api = getApi();
let alice: KeyringPair;
let programId: HexString;
let inheritor: HexString;
let program: Program;

const code = Uint8Array.from(readFileSync(TEST_CODE));

beforeAll(async () => {
  await api.isReadyOrError;
  alice = await getAccount('//Alice');
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('GearProgram', () => {
  test('upload test_meta', async () => {
    programId = api.program.upload({
      code,
      initPayload: [1, 2, 3],
      gasLimit: 200_000_000_000,
    }).programId;
    const status = checkInit(api, programId);
    const [txData] = await sendTransaction(api.program, alice, ['MessageQueued']);
    expect(txData.destination.toHex()).toBe(programId);
    expect(await status).toBe('success');
    program = await Program.new(programId, api, alice);
  });

  test('send message', async () => {
    const result = await program.sendMessage(createPayload('Action', { Two: [8, 16] }).toHex());

    expect(result.success).toBeTruthy();
    expect(result.blockHash).toBeDefined();
    expect(result.blockNumber).toBeDefined();
  });

  test('calculate reply', async () => {
    const payload = createPayload('Action', { Two: [8, 16] }).toHex();

    const result = await program.calculateReply(payload);

    expect(result).toHaveProperty('payload', '0x086f6b');
    expect(result).toHaveProperty('value');
    expect(result).toHaveProperty('code');
    expect(result.code.isSuccess).toBeTruthy();
    expect(Object.keys(result)).toHaveLength(3);
  });

  test('create inheritor program', async () => {
    inheritor = api.program.upload({
      code,
      initPayload: [1, 2, 3],
      gasLimit: 200_000_000_000,
    }).programId;

    const status = checkInit(api, inheritor);
    const [txData] = await sendTransaction(api.program, alice, ['MessageQueued']);
    expect(txData.destination.toHex()).toBe(inheritor);
    expect(await status).toBe('success');
  });

  test('exit', async () => {
    const payload = createPayload('Action', { Exit: inheritor }).toHex();

    const newProgramId = new Promise((resolve) => program.on('programExited', resolve));

    await program.sendMessage(payload);

    expect(await newProgramId).toBe(inheritor);
  });

  test('programId changed', () => {
    expect(program.id).toBe(inheritor);
  });

  test('send msg after exit', async () => {
    const payload = createPayload('Action', { Two: [8, 16] }).toHex();

    const result = await program.sendMessage(payload);

    expect(result.success).toBeTruthy();
  });
});
