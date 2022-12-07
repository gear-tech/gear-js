import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { blake2AsHex } from '@polkadot/util-crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

import { GEAR_EXAMPLES_WASM_DIR } from './config';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { GearApi, getProgramMetadata, Metadata } from '../src';

const api = new GearApi();
let alice: KeyringPair;
let codeId: HexString;
let programId: HexString;

const code = readFileSync(join('test/programs/test-meta/target/wasm32-unknown-unknown/release', 'test_meta.opt.wasm'));
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
    const programMeta = getProgramMetadata(metaHex);
    const metadata = new Metadata(programMeta.reg);

    const program = api.program.upload(
      {
        code,
        gasLimit: 200_000_000_000,
        initPayload: [1, 2, 3],
      },
      programMeta,
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
    expect(metadata.createType(programMeta.init.output!, reply.message.payload).toJSON()).toMatchObject({ One: 1 });
  });

  test('Сreate program', async () => {
    expect(codeId).toBeDefined();
    const programMeta = getProgramMetadata(metaHex);
    const metadata = new Metadata(programMeta.reg);

    const { programId, salt } = api.program.create(
      {
        codeId,
        gasLimit: 200_000_000_000,
        initPayload: [4, 5, 6],
      },
      programMeta,
      programMeta.init.input,
    );

    expect(programId).toBeDefined();
    expect(salt).toBeDefined();

    const status = checkInit(api, programId);
    const waitForReply = api.message.listenToReplies(programId);

    const transactionData = await sendTransaction(api.program, alice, 'MessageEnqueued');

    expect(transactionData.destination).toBe(programId);
    expect(await status()).toBe('success');

    const reply = await waitForReply(transactionData.id);
    expect(metadata.createType(programMeta.init.output!, reply.message.payload).toJSON()).toMatchObject({ One: 1 });
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
    const programs = await api.program.allUploadedPrograms();
    expect(programs).toBeDefined();
    expect(programs.includes(programId)).toBeTruthy();
  });

  test('Program exists', async () => {
    const programs = await api.program.exists(programId);
    expect(programs).toBeTruthy();
  });

  test('Get hash of program metadata', async () => {
    const metaHash = await api.program.metaHash(programId);
    expect(metaHash).toBe(blake2AsHex(metaHex, 256));
  });
});
