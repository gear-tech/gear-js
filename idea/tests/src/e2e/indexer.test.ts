import { GearApi, MessageQueued, ProgramMetadata, decodeAddress } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { waitReady } from '@polkadot/wasm-crypto';
import { readFileSync } from 'fs';
import { API_GATEWAY_METHODS, INDEXER_METHODS } from '@gear-js/common';
import * as path from 'node:path';
import { KeyringPair } from '@polkadot/keyring/types';

import base, { PATH_TO_PROGRAMS } from '../config/base';
import { addState, getState, getStatesByFuncName, mapProgramStates } from './programs';
import { IPrepared, IPreparedProgram } from '../interfaces';
import { getAccounts, sleep } from '../utils';
import request from './request';

function hasAllProps(obj: any, props: string[]) {
  for (const p of props) {
    expect(obj).toHaveProperty(p);
  }
}

let genesis: HexString;
let prepared: IPrepared;
let api: GearApi;
let alice: KeyringPair;
let test_meta_id: HexString;

const programs: { programId: string; codeId: string; metahash?: string; hasState: boolean; status: string }[] = [];
const codes: { codeId: string; metahash: string; hasState: boolean }[] = [];
const sentMessages: {
  id: string;
  source: string;
  destination: string;
  payload: string;
  entry: string;
  value: string;
}[] = [];
const receivedMessages: {
  id: string;
  source: string;
  destination: string;
  payload: string;
  value: string;
  replyToMessageId: string;
  expiration: number;
}[] = [];

const metaHex = readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.meta.txt'), 'utf-8');
const meta = ProgramMetadata.from(metaHex);

beforeAll(async () => {
  try {
    api = await GearApi.create({ providerAddress: base.gear.wsProvider, throwOnConnect: true });
  } catch (error) {
    console.log(error);
    process.exit(0);
  }

  genesis = api.genesisHash.toHex();

  await waitReady();
  alice = getAccounts().alice;
  listenToEvents();
});

afterAll(async () => {
  await api.disconnect();
  await sleep();
});

async function listenToEvents() {
  api.gearEvents.subscribeToGearEvent(
    'UserMessageSent',
    ({
      data: {
        message: { id, source, destination, details, payload, value },
        expiration,
      },
    }) => {
      receivedMessages.push({
        id: id.toHex(),
        source: source.toHex(),
        destination: destination.toHex(),
        payload: payload.toHex(),
        value: value.toString(),
        replyToMessageId: details.isSome ? details.unwrap().to.toHex() : null,
        expiration: expiration.isSome ? expiration.unwrap().toNumber() : null,
      });
    },
  );

  api.gearEvents.subscribeToGearEvent('UserMessageRead', ({ data: { reason, id } }) => {
    const msg = receivedMessages.find((msg) => msg.id === id.toHex());
    if (msg) {
      msg['readReason'] = reason.isSystem ? 'OutOfRent' : reason.asRuntime.isMessageClaimed ? 'Claimed' : 'Replied';
    }
  });
}

const finalizationPromises = [];

describe('prepare', () => {
  test('upload test_meta', async () => {
    const code = readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.opt.wasm'));

    const metahash = await api.code.metaHashFromWasm(code);
    const payload = meta.createType(meta.types.init.input!, [1, 2, 3]).toHex();

    const { programId, codeId } = api.program.upload({ code, initPayload: payload, gasLimit: 200_000_000_000 });
    test_meta_id = programId;
    programs.push({ programId, codeId, metahash, hasState: true, status: 'active' });
    codes.push({ codeId, metahash, hasState: true });
    const [mqid, mqsource, mqdestination]: [string, string, string] = await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          api.program.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            events.forEach(({ event }) => {
              if (event.method === 'ExtrinsicFailed') {
                reject(new Error(api.getExtrinsicFailedError(event).docs.join('. ')));
              } else if (event.method === 'MessageQueued') {
                const {
                  data: { id, source, destination },
                } = event as MessageQueued;
                resolve([id.toHex(), source.toHex(), destination.toHex()]);
              }
            });
          });
        }),
      );
    });

    sentMessages.push({ id: mqid, source: mqsource, destination: mqdestination, entry: 'init', payload, value: '0' });
  });

  test('upload test_waitlist', async () => {
    const code = readFileSync(path.join(PATH_TO_PROGRAMS, 'test_waitlist.opt.wasm'));
    const { programId, codeId } = api.program.upload({ code, gasLimit: 200_000_000_000 });
    programs.push({ programId, codeId, metahash: null, hasState: false, status: 'active' });
    codes.push({ codeId, metahash: null, hasState: false });
    const [mqid, mqsource, mqdestination]: [string, string, string] = await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          api.program.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs.join('. ')));
                } else if (event.method === 'MessageQueued') {
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  resolve([id.toHex(), source.toHex(), destination.toHex()]);
                }
              });
            }
          });
        }),
      );
    });

    sentMessages.push({
      id: mqid,
      source: mqsource,
      destination: mqdestination,
      entry: 'init',
      payload: '0x',
      value: '0',
    });
  });

  test('send message to test_meta', async () => {
    const payload = meta.createType(meta.types.handle.input, { One: 'Alice' }).toHex();
    const tx = await api.message.send(
      { destination: test_meta_id, gasLimit: 2_000_000_000, payload, value: 1000 },
      meta,
    );

    await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          tx.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs.join('. ')));
                } else if (event.method === 'MessageQueued') {
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  sentMessages.push({
                    id: id.toHex(),
                    source: source.toHex(),
                    destination: destination.toHex(),
                    entry: 'handle',
                    payload,
                    value: '1000',
                  });
                  resolve(0);
                }
              });
            }
          });
        }),
      );
    });
  });

  test('send batch of messages to test_meta', async () => {
    const txs = [];
    const payloads = [
      meta.createType(meta.types.handle.input, { Two: [[8, 16]] }).toHex(),
      meta
        .createType(meta.types.handle.input, {
          Four: { array8: new Array(8).fill(0), array32: new Array(32).fill(1), actor: decodeAddress(alice.address) },
        })
        .toHex(),
    ];

    txs.push(await api.message.send({ destination: test_meta_id, payload: payloads[0], gasLimit: 200_000_000_000 }));
    txs.push(await api.message.send({ destination: test_meta_id, payload: payloads[1], gasLimit: 200_000_000_000 }));

    const tx = api.tx.utility.batchAll(txs);

    let index = -1;

    await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          tx.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs.join('. ')));
                } else if (event.method === 'MessageQueued') {
                  index++;
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  sentMessages.push({
                    id: id.toHex(),
                    source: source.toHex(),
                    destination: destination.toHex(),
                    entry: 'handle',
                    payload: payloads[index],
                    value: '0',
                  });
                } else if (event.method === 'ExtrinsicSuccess') {
                  resolve(0);
                }
              });
            }
          });
        }),
      );
    });

    expect(index).toBe(1);
  });

  test('wait for finalization', async () => {
    await Promise.all(finalizationPromises);
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
  });

  test.todo('create program');
  test.todo('upload and create programs in batch');
  test.todo('upload code');
  test.todo('upload codes in batch');
  test.todo('send reply');
});

describe('common methods', () => {
  test(API_GATEWAY_METHODS.NETWORK_DATA_AVAILABLE, async () => {
    const response = await request('networkData.available', {
      genesis,
    });

    expect(response).toHaveProperty('result', true);
  });

  test(INDEXER_METHODS.BLOCKS_STATUS, async () => {
    const response = await request('blocks.status', { genesis });

    expect(response).toHaveProperty('result');
    expect(response.result).toHaveProperty('number');
    expect(response.result).toHaveProperty('hash');
    expect(response.result).toHaveProperty('timestamp');
    expect(response.result).toHaveProperty('genesis');
  });
});

describe('program methods', () => {
  test(INDEXER_METHODS.PROGRAM_ALL, async () => {
    const response = await request('program.all', { genesis });
    expect(response).toHaveProperty('result.count', programs.length);
    for (const p of programs) {
      const receivedProgram = response.result.programs.find(({ id }) => id === p.programId);
      expect(receivedProgram).toBeDefined();
      expect(receivedProgram.code.id).toEqual(p.codeId);
      expect(receivedProgram.metahash).toEqual(p.metahash);
    }
  });

  test(INDEXER_METHODS.PROGRAM_ALL + ' by owner', async () => {
    const response = await request('program.all', { genesis, owner: decodeAddress(alice.address) });
    // TODO: upload program from different account
    expect(response).toHaveProperty('result.count', programs.length);
    expect(response.result.programs).toHaveLength(programs.length);
  });

  test(INDEXER_METHODS.PROGRAM_ALL + ' by status', async () => {
    const response = await request('program.all', { genesis, status: 'active' });
    // TODO: check terminated status
    expect(response).toHaveProperty('result.count', programs.length);
    expect(response.result.programs).toHaveLength(programs.length);
  });

  test(INDEXER_METHODS.PROGRAM_ALL + ' by dates', async () => {
    const fromDate = new Date();
    fromDate.setMinutes(fromDate.getMinutes() - 3);
    const toDate = new Date();
    const response = await request('program.all', { genesis, fromDate, toDate });
    expect(response).toHaveProperty('result.count', programs.length);
    expect(response.result.programs).toHaveLength(programs.length);
  });

  test(INDEXER_METHODS.PROGRAM_DATA, async () => {
    for (const p of programs) {
      const response = await request('program.data', { genesis, id: p.programId });

      expect(response).toHaveProperty('result');

      hasAllProps(response.result, [
        'id',
        '_id',
        'blockHash',
        'genesis',
        'owner',
        'name',
        'timestamp',
        'metahash',
        'status',
        'code',
        'hasState',
        'expiration',
      ]);
      // expect(response.result.hasState).toBe(p.hasState); TODO: check after meta is uploaded
      expect(response.result.status).toBe(p.status);
      expect(response.result.metahash).toBe(p.metahash);
      expect(response.result.code.id).toBe(p.codeId);
    }
  });
  test.todo(INDEXER_METHODS.PROGRAM_NAME_ADD);
});

describe('code methods', () => {
  test(INDEXER_METHODS.CODE_ALL, async () => {
    const response = await request('code.all', { genesis });
    expect(response).toHaveProperty('result');
    hasAllProps(response.result, ['listCode', 'count']);
    expect(response.result.count).toBe(codes.length);
    for (const c of codes) {
      const code = response.result.listCode.find(({ id }) => id === c.codeId);
      expect(code).toBeDefined;
      expect(code.metahash).toEqual(c.metahash);
    }
  });

  test(INDEXER_METHODS.CODE_ALL + ' by dates', async () => {
    const fromDate = new Date();
    fromDate.setMinutes(fromDate.getMinutes() - 3);
    const toDate = new Date();
    const response = await request('code.all', { genesis, fromDate, toDate });
    expect(response).toHaveProperty('result');
    expect(response.result.count).toBe(codes.length);
  });

  test(INDEXER_METHODS.CODE_DATA, async () => {
    for (const c of codes) {
      const response = await request('code.data', { genesis, id: c.codeId });
      expect(response).toHaveProperty('result');
      hasAllProps(response.result, [
        'id',
        '_id',
        'uploadedBy',
        'name',
        'status',
        'expiration',
        'genesis',
        'blockHash',
        'timestamp',
        'programs',
        'metahash',
        'hasState',
      ]);
      expect(response.result.metahash).toBe(c.metahash);
      expect(response.result.id).toBe(c.codeId);
    }
  });

  test.todo(INDEXER_METHODS.CODE_NAME_ADD);
  test.todo(INDEXER_METHODS.CODE_STATE_GET);
});

describe('message methods', () => {
  test(INDEXER_METHODS.MESSAGE_ALL, async () => {
    const response = await request('message.all', { genesis });
    expect(response).toHaveProperty('result.count', sentMessages.length + receivedMessages.length);
    hasAllProps(response.result, ['messages', 'count']);
    expect(response.result.messages).toHaveLength(sentMessages.length + receivedMessages.length);
  });

  test(INDEXER_METHODS.MESSAGE_ALL + ' by dates', async () => {
    const fromDate = new Date();
    fromDate.setMinutes(fromDate.getMinutes() - 3);
    const toDate = new Date();
    const response = await request('message.all', { genesis, fromDate, toDate });
    expect(response).toHaveProperty('result.count', sentMessages.length + receivedMessages.length);
    hasAllProps(response.result, ['messages', 'count']);
    expect(response.result.messages).toHaveLength(sentMessages.length + receivedMessages.length);
  });

  test(INDEXER_METHODS.MESSAGE_DATA, async () => {
    for (const m of sentMessages) {
      const response = await request('message.data', { genesis, id: m.id });

      expect(response).toHaveProperty('result');
      const { result } = response;
      hasAllProps(response.result, [
        'id',
        'blockHash',
        'genesis',
        'timestamp',
        'destination',
        'source',
        'payload',
        'entry',
        'expiration',
        'replyToMessageId',
        'exitCode',
        'processedWithPanic',
        'value',
        'type',
        'readReason',
        'program',
      ]);

      expect(result.id).toEqual(m.id);
      expect(result.destination).toEqual(m.destination);
      expect(result.source).toEqual(m.source);
      expect(result.payload).toEqual(m.payload);
      expect(result.entry).toEqual(m.entry);
      expect(result.value).toEqual(m.value);
    }

    for (const m of receivedMessages) {
      const response = await request('message.data', { genesis, id: m.id });
      expect(response).toHaveProperty('result');
      const { result } = response;
      hasAllProps(response.result, [
        'id',
        'blockHash',
        'genesis',
        'timestamp',
        'destination',
        'source',
        'payload',
        'entry',
        'expiration',
        'replyToMessageId',
        'exitCode',
        'processedWithPanic',
        'value',
        'type',
        'readReason',
        'program',
      ]);

      expect(result.id).toEqual(m.id);
      expect(result.destination).toEqual(m.destination);
      expect(result.source).toEqual(m.source);
      console.log(m.id);
      expect(result.payload).toEqual(m.payload);
      expect(result.value).toEqual(m.value);
      expect(result.expiration).toEqual(m.expiration);
      expect(result.replyToMessageId).toEqual(m.replyToMessageId);
    }
  });
});

describe('state methods', () => {
  test.todo(INDEXER_METHODS.PROGRAM_STATE_ADD);
  test.todo(INDEXER_METHODS.PROGRAM_STATE_ALL);
  test.todo(INDEXER_METHODS.STATE_GET);
});

describe.skip('Indexer methods', () => {
  test(INDEXER_METHODS.PROGRAM_STATE_ADD, async () => {
    for (const id of Object.keys(prepared.programs)) {
      const program = prepared.programs[id] as IPreparedProgram;
      if (!program.spec['pathStates']) continue;

      const programStatesPath = program.spec.pathStates;
      for (const statePath of programStatesPath) {
        expect(await addState(genesis, program, statePath)).toBeTruthy();
      }
    }
  });

  test(INDEXER_METHODS.PROGRAM_STATE_ALL, async () => {
    for (const id of Object.keys(prepared.programs)) {
      const program = prepared.programs[id] as IPreparedProgram;

      if (mapProgramStates.has(id)) {
        const statesInDB = mapProgramStates.get(id);

        for (const state of statesInDB) {
          const name = Object.keys(state.functions)[0];
          expect(await getStatesByFuncName(genesis, program, name)).toBeTruthy();
        }
      }
    }

    for (const id of Object.keys(prepared.programs)) {
      const program = prepared.programs[id] as IPreparedProgram;

      if (mapProgramStates.has(id)) {
        const statesInDB = mapProgramStates.get(id);

        for (const state of statesInDB) {
          const name = Object.keys(state.functions)[0];
          expect(await getStatesByFuncName(genesis, program, name)).toBeTruthy();
        }
      }
    }
  });

  test(INDEXER_METHODS.STATE_GET, async () => {
    for (const id of Object.keys(prepared.programs)) {
      if (mapProgramStates.has(id)) {
        const statesInDB = mapProgramStates.get(id);

        for (const state of statesInDB) {
          expect(await getState(genesis, state)).toBeTruthy();
        }
      }
    }
  });
});
