import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { blake2AsHex } from '@polkadot/util-crypto';
import { join } from 'path';
import { readFileSync } from 'fs';

import { GearApi, getProgramMetadata } from '../src';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { TARGET } from './config';

const api = new GearApi();
let alice: KeyringPair;
let codeId: HexString;
let programId: HexString;

const code = readFileSync(join(TARGET, 'test_meta.opt.wasm'));
const metaHex: HexString = `0x${readFileSync('test/programs/test-meta/meta.txt', 'utf-8')}`;

beforeAll(async () => {
  await api.isReadyOrError;
  [alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('New Program', () => {
  test('Upload program', async () => {
    const metadata = getProgramMetadata(metaHex);

    const program = api.program.upload(
      {
        code,
        gasLimit: 200_000_000_000,
        initPayload: [1, 2, 3],
      },
      metadata,
    );
    expect(program.programId).toBeDefined();
    expect(program.salt).toBeDefined();
    expect(program.codeId).toBeDefined();
    programId = program.programId;
    codeId = program.codeId;

    const status = checkInit(api, program.programId);
    const waitForReply = api.message.listenToReplies(programId);

    const transactionData = await sendTransaction(program.extrinsic, alice, 'MessageEnqueued');

    expect(transactionData.destination).toBe(program.programId);
    expect(await status()).toBe('success');

    const reply = await waitForReply(transactionData.id);
    expect(metadata.createType(metadata.types.init.output!, reply.message.payload).toJSON()).toMatchObject({ One: 1 });
  });

  test('Сreate program', async () => {
    expect(codeId).toBeDefined();
    const metadata = getProgramMetadata(metaHex);

    const { programId, salt } = api.program.create(
      {
        codeId,
        gasLimit: 200_000_000_000,
        initPayload: [4, 5, 6],
      },
      metadata,
      metadata.types.init.input,
    );

    expect(programId).toBeDefined();
    expect(salt).toBeDefined();

    const status = checkInit(api, programId);
    const waitForReply = api.message.listenToReplies(programId);

    const transactionData = await sendTransaction(api.program, alice, 'MessageEnqueued');

    expect(transactionData.destination).toBe(programId);
    expect(await status()).toBe('success');

    const reply = await waitForReply(transactionData.id);
    expect(metadata.createType(metadata.types.init.output!, reply.message.payload).toJSON()).toMatchObject({ One: 1 });
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

describe('Program', () => {
  test('Get all uploaded programs', async () => {
    expect(programId).toBeDefined();
    const programs = await api.program.allUploadedPrograms();
    expect(programs).toBeDefined();
    expect(programs.includes(programId)).toBeTruthy();
  });

  test('Program exists', async () => {
    expect(programId).toBeDefined();
    const isExist = await api.program.exists(programId);
    expect(isExist).toBeTruthy();
  });

  test('Get code hash', async () => {
    expect(programId).toBeDefined();
    expect(codeId).toBeDefined();
    const codeHash = await api.program.codeHash(programId);
    expect(codeHash).toBe(codeId);
  });

  test('Get hash of program metadata', async () => {
    expect(programId).toBeDefined();
    const metaHash = await api.program.metaHash(programId);
    expect(metaHash).toBe(blake2AsHex(metaHex, 256));
  });

  test('Get program storage', async () => {
    expect(programId).toBeDefined();
    const program = await api.programStorage.getProgram(programId);
    expect(program).toBeDefined();
  });

  test('Get program pages', async () => {
    expect(programId).toBeDefined();
    const program = await api.programStorage.getProgram(programId);
    const pages = await api.programStorage.getProgramPages(programId, program);
    expect(Object.keys(pages)).not.toHaveLength(0);
  });
});
