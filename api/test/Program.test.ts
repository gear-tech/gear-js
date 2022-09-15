import { readFileSync } from 'fs';
import { join } from 'path';
import { KeyringPair } from '@polkadot/keyring/types';

import { GEAR_EXAMPLES_WASM_DIR } from './config';
import { checkInit, getAccount, sendTransaction, sleep, testif } from './utilsFunctions';
import { Hex } from '../src/types';
import { GearApi } from '../src';

const api = new GearApi();
let someProgramId: Hex;
let alice: KeyringPair;
let codeId: Hex;

beforeAll(async () => {
  await api.isReadyOrError;
  [alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Upload program', () => {
  test('demo_ping', async () => {
    const code = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_ping.opt.wasm'));
    const program = api.program.upload({
      code,
      gasLimit: 2_000_000_000,
    });
    expect(program.programId).toBeDefined();
    expect(program.salt).toBeDefined();
    expect(program.codeId).toBeDefined();
    codeId = program.codeId;

    const status = checkInit(api, program.programId);
    const transactionData = await sendTransaction(api.program, alice, 'MessageEnqueued');
    expect(transactionData.destination).toBe(program.programId);
    expect(await status()).toBe('success');
  });

  testif(!!codeId)('Сreate program', async () => {
    const { programId, salt } = api.program.create({
      codeId,
      gasLimit: 2_000_000_000,
    });
    expect(programId).toBeDefined();
    expect(salt).toBeDefined();

    const status = checkInit(api, programId);
    const transactionData = await sendTransaction(api.program, alice, 'MessageEnqueued');
    expect(transactionData.destination).toBe(programId);
    expect(await status()).toBe('success');
  });
});

describe('Program', () => {
  test('Get all uploaded programs', async () => {
    const programs = await api.program.allUploadedPrograms();
    someProgramId = programs[0];
    expect(programs).toBeDefined();
  });

  test('Program exists', async () => {
    const programs = await api.program.exists(someProgramId);
    expect(programs).toBeTruthy();
  });

  test('Throw error if value is incorrect', () => {
    expect(() =>
      api.program.upload({ code: Buffer.from('0x00'), gasLimit: 1000, value: api.existentialDeposit.toNumber() - 1 }),
    ).toThrow(`Value less than minimal. Minimal value: ${api.existentialDeposit.toString()}`);
  });

  test('Not to throw error if value is correct', () => {
    expect(() =>
      api.program.upload({ code: Buffer.from('0x00'), gasLimit: 1000, value: api.existentialDeposit.toNumber() }),
    ).not.toThrow();
  });

  test('Throw error if gasLimit too high', () => {
    expect(() => api.program.upload({ code: Buffer.from('0x00'), gasLimit: api.blockGasLimit.addn(1) })).toThrow(
      `GasLimit too high. Maximum gasLimit value is ${api.blockGasLimit.toHuman()}`,
    );
  });

  test('Not to throw error if gasLimit is correct', () => {
    expect(() => api.program.upload({ code: Buffer.from('0x00'), gasLimit: api.blockGasLimit })).not.toThrow();
  });
});
