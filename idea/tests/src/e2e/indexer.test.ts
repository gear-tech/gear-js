import { GearApi, MessageQueued, getProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { waitReady } from '@polkadot/wasm-crypto';
import { readFileSync } from 'fs';
import { API_GATEWAY_METHODS, INDEXER_METHODS } from '@gear-js/common';
import * as path from 'node:path';
import { KeyringPair } from '@polkadot/keyring/types';

import base, { PATH_TO_PROGRAMS } from '../config/base';
import {
  addState,
  checkInitStatus,
  getAllPrograms,
  getAllProgramsByDates,
  getAllProgramsByOwner,
  getAllProgramsByStatus,
  getProgramData,
  getProgramDataInBatch,
  getState,
  getStatesByFuncName,
  mapProgramStates,
} from './programs';
import { IPrepared, IPreparedProgram, IPreparedPrograms } from '../interfaces';
import { getAccounts, sleep } from '../utils';
import { getAllMessages, getMessageData, getMessagePayload, getMessagesByDates } from './messages';
import { getCodeData, getCodes, getCodesByDates } from './code';
import { networkDataAvailable } from './network-data-available';
import { blocksStatus } from './block';

let genesis: HexString;
let prepared: IPrepared;
let api: GearApi;
let alice: KeyringPair;
let test_meta_id: HexString;

const programs = [];
const codes = [];
const sentMessages = [];
const receivedMessages = [];

const metaHex = readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.meta.txt'), 'utf-8');
const meta = getProgramMetadata(metaHex);

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

describe('upload programs', () => {
  test('upload test_meta', async () => {
    const code = readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.opt.wasm'));

    const metahash = await api.code.metaHashFromWasm(code);
    const payload = meta.createType(meta.types.init.input!, [1, 2, 3]).toHex();

    const { programId, codeId } = api.program.upload({ code, initPayload: payload, gasLimit: 200_000_000_000 });
    test_meta_id = programId;
    programs.push({ programId, codeId, metahash, hasState: true });
    codes.push({ codeId, metahash, hasState: true });
    const [mqid, mqsource, mqdestination]: [string, string, string] = await new Promise((resolve, reject) =>
      api.program.signAndSend(alice, ({ events }) => {
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
      }),
    );

    sentMessages.push({ id: mqid, source: mqsource, destination: mqdestination, entry: 'init', payload });
  });

  test('upload test_waitlist', async () => {
    const code = readFileSync(path.join(PATH_TO_PROGRAMS, 'test_waitlist.opt.wasm'));
    const { programId, codeId } = api.program.upload({ code, gasLimit: 200_000_000_000 });
    programs.push({ programId, codeId, metahash: null, hasState: false });
    codes.push({ codeId, metahash: null, hasState: false });
    const [mqid, mqsource, mqdestination]: [string, string, string] = await new Promise((resolve, reject) =>
      api.program.signAndSend(alice, ({ events }) => {
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
      }),
    );

    sentMessages.push({ id: mqid, source: mqsource, destination: mqdestination, entry: 'init', payload: '0x' });
  });

  test('send message to test_meta', async () => {
    const payload = meta.createType(meta.types.handle.input, { One: 'Alice' }).toHex();
    const tx = api.message.send({ destination: test_meta_id, gasLimit: 2_000_000_000, payload, value: 1000 }, meta);

    await new Promise((resolve, reject) =>
      tx.signAndSend(alice, ({ events }) => {
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
            });
            resolve(0);
          }
        });
      }),
    );
  });

  test('send batch of messages to test_meta', async () => {
    const txs = [];
    const payload_0 = meta.createType(meta.types.handle.input, { Two: [[8, 16]] }).toHex();
    txs.push(api.message.send({ destination: test_meta_id, payload: payload_0, gasLimit: 200_000_000_000 }));
    const payload_1 = meta.createType(meta.types.handle.input, { Three: { field: { Ok: 23 } } }).toHex();
    txs.push(api.message.send({ destination: test_meta_id, payload: payload_1, gasLimit: 200_000_000_000 }));

    const tx = api.tx.utility.batchAll(txs);

    await new Promise((resolve, reject) =>
      tx.signAndSend(alice, ({ events }) => {
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
              // payload,
            });
            resolve(0);
          }
        });
      }),
    );
  });
});

describe.skip('Indexer methods', () => {
  test(API_GATEWAY_METHODS.NETWORK_DATA_AVAILABLE, async () => {
    expect(await networkDataAvailable(genesis)).toBeTruthy();
  });

  test(INDEXER_METHODS.BLOCKS_STATUS, async () => {
    expect(await blocksStatus(genesis)).toBeTruthy();
  });

  test(INDEXER_METHODS.PROGRAM_ALL, async () => {
    expect(await getAllPrograms(genesis, Object.keys(prepared.programs) as HexString[])).toBeTruthy();
    expect(await getAllProgramsByOwner(genesis, prepared.programs as IPreparedPrograms)).toBeTruthy();
    expect(await getAllProgramsByStatus(genesis, 'active')).toBeTruthy();
    expect(await getAllProgramsByStatus(genesis, 'terminated')).toBeTruthy();
    expect(await getAllProgramsByDates(genesis, new Date())).toBeTruthy();
  });

  test(INDEXER_METHODS.PROGRAM_DATA, async () => {
    for (const id of Object.keys(prepared.programs)) {
      expect(await getProgramData(genesis, id)).toBeTruthy();
    }
    expect(await getProgramDataInBatch(genesis, Object.keys(prepared.programs)[0])).toBeTruthy();
    for (const id of Object.keys(prepared.programs)) {
      expect(await checkInitStatus(genesis, id, prepared.programs[id].init)).toBeTruthy();
    }
  });

  test.todo(INDEXER_METHODS.PROGRAM_NAME_ADD);

  test(INDEXER_METHODS.CODE_ALL, async () => {
    const codeIds = Array.from(prepared.collectionCode.keys());
    expect(await getCodes(genesis, codeIds)).toBeTruthy();

    expect(await getCodesByDates(genesis, new Date())).toBeTruthy();
  });

  test(INDEXER_METHODS.CODE_DATA, async () => {
    const codeId = Array.from(prepared.collectionCode.keys())[1];
    expect(await getCodeData(genesis, codeId)).toBeTruthy();
  });

  test.todo(INDEXER_METHODS.CODE_NAME_ADD);

  test(INDEXER_METHODS.MESSAGE_ALL, async () => {
    const messages = Array.from(prepared.messages.log.keys()).concat(
      Array.from(prepared.messages.sent.values()).map(({ id }) => id),
    ) as HexString[];
    Object.values(prepared.programs).forEach(({ messageId }) => messages.push(messageId));
    expect(await getAllMessages(genesis, messages)).toBeTruthy();

    expect(await getMessagesByDates(genesis, new Date())).toBeTruthy();
  });

  test(INDEXER_METHODS.MESSAGE_DATA, async () => {
    for (const message of prepared.messages.log) {
      expect(await getMessageData(genesis, message[0])).toBeTruthy();
    }
    for (const [_, value] of prepared.messages.sent) {
      expect(await getMessagePayload(genesis, value.id));
    }
  });

  test.todo(INDEXER_METHODS.CODE_STATE_GET);

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
