import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { blake2AsHex } from '@polkadot/util-crypto';
import { bufferToU8a } from '@polkadot/util';
import { join } from 'path';
import { readFileSync } from 'fs';

import { GearApi, ProgramMetadata, decodeAddress } from '../src';
import { TARGET, TEST_META_META, WS_ADDRESS } from './config';
import { checkInit, getAccount, sendTransaction, sleep, waitForPausedProgram } from './utilsFunctions';

const api = new GearApi({ providerAddress: WS_ADDRESS });
let alice: KeyringPair;
let codeId: HexString;
let programId: HexString;
let expiration: number;
let metaHash: HexString;
let expiredBN: number;
let pausedBlockHash: HexString;

const code = readFileSync(join(TARGET, 'test_meta.opt.wasm'));
const metaHex: HexString = `0x${readFileSync(TEST_META_META, 'utf-8')}`;

beforeAll(async () => {
  await api.isReadyOrError;
  alice = await getAccount('//Alice');
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('New Program', () => {
  test('Upload program', async () => {
    const metadata = ProgramMetadata.from(metaHex);

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

    let programSetExpiration: number;
    let activeExpiration: number;
    let isProgramSetHappened = false;
    let isActiveHappened = false;

    const status = checkInit(api, program.programId, (st, exp) => {
      if (st === 'ProgramSet') {
        isProgramSetHappened = true;
        if (exp) programSetExpiration = exp;
      } else if (st === 'Active') {
        isActiveHappened = true;
        if (exp) activeExpiration = exp;
      }
    });

    const [pcData, mqData, blockHash] = await sendTransaction(program.extrinsic, alice, [
      'ProgramChanged',
      'MessageQueued',
    ]);

    expect(pcData.id.toHex()).toBe(programId);
    expect(pcData.change.isProgramSet).toBeTruthy();
    expect(pcData.change.asProgramSet.expiration.toNumber()).toBeGreaterThan(0);
    expiredBN = pcData.change.asProgramSet.expiration.toNumber();

    expect(await status).toBe('success');

    const reply = await api.message.getReplyEvent(programId, mqData.id.toHex(), blockHash);
    expect(metadata.createType(metadata.types.init.output!, reply.data.message.payload).toJSON()).toMatchObject({
      One: 1,
    });
    expect(isProgramSetHappened).toBeTruthy();
    expect(isActiveHappened).toBeTruthy();
  });

  test.skip('Wait when program will be paused', async () => {
    const [id, blockHash] = await waitForPausedProgram(api, programId, expiredBN);
    expect(id).toBe(programId);
    expect(blockHash).toBeDefined();
    pausedBlockHash = blockHash;
  });

  test('Сreate program', async () => {
    expect(codeId).toBeDefined();
    const metadata = ProgramMetadata.from(metaHex);

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

    const programChangedStatuses: string[] = [];

    const status = checkInit(api, programId, (st) => {
      programChangedStatuses.push(st);
    });

    const [transactionData, blockHash] = await sendTransaction(api.program, alice, ['MessageQueued']);

    expect(transactionData.destination.toHex()).toBe(programId);
    expect(await status).toBe('success');

    expect(programChangedStatuses).toContain('ProgramSet');
    expect(programChangedStatuses).toContain('Active');

    const reply = await api.message.getReplyEvent(programId, transactionData.id.toHex(), blockHash);
    expect(metadata.createType(metadata.types.init.output!, reply.data.message.payload).toJSON()).toMatchObject({
      One: 1,
    });
  });

  test('Throw error if value is incorrect', () => {
    expect(() =>
      api.program.upload({ code: Buffer.from('0x00'), gasLimit: 1000, value: api.existentialDeposit.toNumber() - 1 }),
    ).toThrow(`Value less than minimal. Minimal value: ${api.existentialDeposit.toHuman()}`);
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

  test.skip('Pay program rent', async () => {
    const tx = await api.program.payRent(programId, 10_000);
    const [result] = await sendTransaction(tx, alice, ['ProgramChanged']);
    expect(result).toHaveProperty('id');
    expect(result.id.toHex()).toBe(programId);
    expect(result.change.isExpirationChanged).toBeTruthy();
    expect(result.change.asExpirationChanged.expiration).toBeDefined();
    expect(Number(result.change.asExpirationChanged.expiration.toNumber())).toBe(expiration + 10_000);
  });

  test.skip('Calculate pay rent', () => {
    const costPerBlock = api.program.costPerBlock;
    const pay = api.program.calcualtePayRent(10_000);
    expect(pay.toString()).toBe(costPerBlock.muln(10_000).toString());
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

  test('Get metahash by program id', async () => {
    expect(programId).toBeDefined();
    metaHash = await api.program.metaHash(programId);
    expect(metaHash).toBe(blake2AsHex(metaHex, 256));
  });

  test('Get metahash by codeId', async () => {
    expect(programId).toBeDefined();
    expect(codeId).toBeDefined();
    const codeMetaHash = await api.code.metaHash(codeId);
    expect(codeMetaHash).toBe(metaHash);
  });

  test('Get metahash by wasm', async () => {
    const codeMetaHash = await api.code.metaHashFromWasm(code);
    expect(codeMetaHash).toBe(metaHash);
  });

  test('Get metahash by wasm if it is Uint8Array', async () => {
    const codeMetaHash = await api.code.metaHashFromWasm(bufferToU8a(code));
    expect(codeMetaHash).toBe(metaHash);
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

  // test.skip('Resume program', async () => {
  //   expect(programId).toBeDefined();
  //   expect(pausedBlockHash).toBeDefined();

  //   const parentBlock = (await api.blocks.get(pausedBlockHash)).block.header.parentHash.toHex();

  //   const program = await api.programStorage.getProgram(programId, parentBlock);

  //   const initTx = api.program.resumeSession.init({
  //     programId,
  //     allocations: program.allocations,
  //     codeHash: program.codeHash.toHex(),
  //   });

  //   const [txData] = await sendTransaction(initTx, alice, ['ProgramResumeSessionStarted']);

  //   expect(txData.sessionId).toBeDefined();
  //   expect(txData.accountId).toBeDefined();
  //   expect(txData.accountId.toHex()).toBe(decodeAddress(alice.address));
  //   expect(txData.programId).toBeDefined();
  //   expect(txData.programId.toHex()).toBe(programId);
  //   expect(txData.sessionEndBlock).toBeDefined();

  //   const sessionId = txData.sessionId.toNumber();

  //   const pages = await api.programStorage.getProgramPages(programId, program, parentBlock);

  //   const memoryPages = Object.entries(pages);

  //   const txs: any = [];

  //   for (const memPage of memoryPages) {
  //     txs.push(api.program.resumeSession.push({ sessionId, memoryPages: [memPage] }));
  //   }

  //   await new Promise((resolve) =>
  //     api.tx.utility.batchAll(txs).signAndSend(alice, ({ events }) => {
  //       events.forEach(({ event: { method } }) => {
  //         if (method === 'BatchCompleted') {
  //           resolve(true);
  //         }
  //       });
  //     }),
  //   );

  //   await new Promise((resolve) =>
  //     api.program.resumeSession.commit({ sessionId, blockCount: 20_000 }).signAndSend(alice, ({ status }) => {
  //       if (status.isFinalized) {
  //         resolve(true);
  //       }
  //     }),
  //   );
  // });
});
