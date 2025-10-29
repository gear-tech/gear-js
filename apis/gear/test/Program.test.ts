import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { readFileSync } from 'fs';

import { TEST_CODE } from './config';
import { checkInit, createPayload, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { getApi } from './common';

const api = getApi();
let alice: KeyringPair;
let codeId: HexString;
let programId: HexString;

const code = Uint8Array.from(readFileSync(TEST_CODE));

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
    const program = api.program.upload({
      code,
      gasLimit: api.blockGasLimit,
      initPayload: [1, 2, 3],
    });
    expect(program.programId).toBeDefined();
    expect(program.salt).toBeDefined();
    expect(program.codeId).toBeDefined();
    programId = program.programId;
    codeId = program.codeId;

    let isProgramSetHappened = false;
    let isActiveHappened = false;

    const status = checkInit(api, program.programId, (st) => {
      if (st === 'ProgramSet') {
        isProgramSetHappened = true;
      } else if (st === 'Active') {
        isActiveHappened = true;
      } else {
        throw new Error(`Unexpected status: ${st}`);
      }
    });

    const [pcData, mqData, blockHash] = await sendTransaction(program.extrinsic, alice, [
      'ProgramChanged',
      'MessageQueued',
    ]);

    expect(pcData.id.toHex()).toBe(programId);
    expect(pcData.change.isProgramSet).toBeTruthy();
    expect(pcData.change.asProgramSet.expiration.toNumber()).toBeGreaterThan(0);

    expect(await status).toBe('success');

    const reply = await api.message.getReplyEvent(programId, mqData.id.toHex(), blockHash);
    expect(createPayload('Init', reply.data.message.payload).toJSON()).toMatchObject({
      One: 1,
    });
    expect(isProgramSetHappened).toBeTruthy();
    expect(isActiveHappened).toBeTruthy();
  });

  test('Create program', async () => {
    expect(codeId).toBeDefined();

    const { programId, salt } = api.program.create({
      codeId,
      gasLimit: 200_000_000_000,
      initPayload: [4, 5, 6],
    });

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
    expect(createPayload('Init', reply.data.message.payload).toJSON()).toMatchObject({
      One: 1,
    });
  });

  test('Throw error if value is incorrect', () => {
    expect(() =>
      api.program.upload({ code: Uint8Array.from([0]), gasLimit: 1000, value: api.existentialDeposit.toNumber() - 1 }),
    ).toThrow(`Value less than minimal. Minimal value: ${api.existentialDeposit.toHuman()}`);
  });

  test('Not to throw error if value is correct', () => {
    expect(() =>
      api.program.upload({ code: Uint8Array.from([0]), gasLimit: 1000, value: api.existentialDeposit.toNumber() }),
    ).not.toThrow();
  });

  test('Throw error if gasLimit too high', () => {
    expect(() => api.program.upload({ code: Uint8Array.from([0]), gasLimit: api.blockGasLimit.addn(1) })).toThrow(
      `GasLimit too high. Maximum gasLimit value is ${api.blockGasLimit.toHuman()}`,
    );
  });

  test('Not to throw error if gasLimit is correct', () => {
    expect(() => api.program.upload({ code: Uint8Array.from([0]), gasLimit: api.blockGasLimit })).not.toThrow();
  });
});

describe('Program Storage', () => {
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

  test('Get program storage', async () => {
    expect(programId).toBeDefined();
    const program = await api.programStorage.getProgram(programId);
    expect(program).toBeDefined();
  });

  test('Get program pages', async () => {
    expect(programId).toBeDefined();
    const program = await api.programStorage.getProgram(programId);
    const pages = await api.programStorage.getProgramPages(programId, program);
    expect(Object.keys(pages)).toHaveLength(2);
  });
});

describe('Subscriptions', () => {
  test('subscribe to program state changes', async () => {
    const subResults: { blockHash: string; programIds: string[] }[] = [];

    const unsub = await api.program.subscribeToStateChanges(null, (blockHash, programIds) => {
      subResults.push({ blockHash, programIds });
    });

    const { programId, extrinsic } = api.program.create({
      codeId,
      gasLimit: api.blockGasLimit,
      initPayload: [4, 5, 6],
    });

    const blockHash = await new Promise((resolve, reject) =>
      extrinsic.signAndSend(alice, ({ status, events }) => {
        if (status.isInBlock) {
          const success = events.find(({ event: { method } }) => method === 'ExtrinsicSuccess');

          if (success) {
            resolve(status.asInBlock.toHex());
          } else {
            const failed = events.find(({ event: { method } }) => method === 'ExtrinsicFailed');
            if (failed) {
              reject(api.getExtrinsicFailedError(failed.event));
            }
          }
        }
      }),
    );

    expect(subResults).toHaveLength(1);

    expect(subResults[0].blockHash).toBe(blockHash);
    expect(subResults[0].programIds[0]).toBe(programId);

    unsub();
  });
});
