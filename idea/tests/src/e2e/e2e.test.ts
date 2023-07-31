import { GearApi, generateCodeHash } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { waitReady } from '@polkadot/wasm-crypto';
import { readFileSync } from 'fs';
import { API_GATEWAY_METHODS, INDEXER_METHODS, META_STORAGE_METHODS, TEST_BALANCE_METHODS } from '@gear-js/common';

import base from '../config/base';
import {
  addState,
  checkInitStatus,
  getAllPrograms,
  getAllProgramsByDates,
  getAllProgramsByOwner,
  getAllProgramsByStatus,
  getMeta,
  getProgramData,
  getProgramDataInBatch,
  getState,
  getStates,
  getStatesByFuncName,
  mapProgramStates,
  uploadMeta,
} from './programs';
import { processPrepare } from '../prepare';
import { IPrepared, IPreparedProgram, IPreparedPrograms } from '../interfaces';
import { sleep } from '../utils';
import { getAllMessages, getMessageData, getMessagePayload, getMessagesByDates } from './messages';
import { getTestBalance, getTestBalanceSeveralTimesAtATime, testBalanceAvailable } from './testBalance';
import { getCodeData, getCodes, getCodesByDates } from './code';
import { networkDataAvailable } from './network-data-available';
import { blocksStatus } from './block';
import {
  errorCodeNotFound,
  errorInvalidMetaHex,
  errorInvalidParams,
  errorMessageNotFound,
  errorMetaNotFound,
  errorMethodNotExist,
  errorNoGenesisFound,
  errorProgramNotFound,
  errorStateAlreadyExists,
  unknownNetworkError,
} from './json-rpc.errors';

let genesis: HexString;
let prepared: IPrepared;
let api: GearApi;

beforeAll(async () => {
  try {
    api = await GearApi.create({ providerAddress: base.gear.wsProvider, throwOnConnect: true });
  } catch (error) {
    console.log(error);
    process.exit(0);
  }

  genesis = api.genesisHash.toHex();

  await waitReady();
  try {
    prepared = await processPrepare(api);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});

afterAll(async () => {
  await api.disconnect();
  await sleep();
});

describe('Indexer methods', () => {
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

describe('Meta storage methods', () => {
  test(META_STORAGE_METHODS.META_ADD, async () => {
    for (const id of Object.keys(prepared.programs)) {
      const program = prepared.programs[id] as IPreparedProgram;

      if (program.spec['pathToMetaTxt']) {
        expect(await uploadMeta(program)).toBeTruthy();
      }
    }
  });

  test(META_STORAGE_METHODS.META_GET, async () => {
    for (const id of Object.keys(prepared.programs)) {
      const program = prepared.programs[id] as IPreparedProgram;

      if (program.spec['pathToMetaTxt']) {
        const hex: HexString = `0x${readFileSync(program.spec.pathToMetaTxt, 'utf-8')}`;

        const hash = generateCodeHash(hex);
        expect(await getMeta(hash)).toBeTruthy();
      }
    }
    // TODO: request meta by codeHash
  });

  test('check that *hasState* field is set to true', async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    for (const id of Object.keys(prepared.programs)) {
      const program = prepared.programs[id] as IPreparedProgram;

      if (program.spec['pathToMetaTxt']) {
        expect(await getProgramData(genesis, program.id, true)).toBeTruthy();
      }
    }
  });
});

describe('Test balance methods', () => {
  test(API_GATEWAY_METHODS.TEST_BALANCE_AVAILABLE, async () => {
    expect(await getTestBalance(genesis)).toBeTruthy();
    expect(await getTestBalanceSeveralTimesAtATime(genesis)).toBeTruthy();
  });
  test(TEST_BALANCE_METHODS.TEST_BALANCE_GET, async () => {
    expect(await testBalanceAvailable(genesis)).toBeTruthy();
  });
});

describe('JSON_RPC errors', () => {
  test('error method not exist', async () => {
    expect(await errorMethodNotExist(genesis)).toBeTruthy();
  });

  test('error invalid params', async () => {
    expect(await errorInvalidParams(genesis)).toBeTruthy();
  });

  test('error no genesis found', async () => {
    expect(await errorNoGenesisFound()).toBeTruthy();
  });

  test('error unknown network', async () => {
    expect(await unknownNetworkError(genesis)).toBeTruthy();
  });

  test('error program not found', async () => {
    expect(await errorProgramNotFound(genesis)).toBeTruthy();
  });

  test('error code not found', async () => {
    expect(await errorCodeNotFound(genesis)).toBeTruthy();
  });

  test('error message not found', async () => {
    expect(await errorMessageNotFound(genesis)).toBeTruthy();
  });

  test.skip('error message invalid meta hex', async () => {
    const invalidMetaHex = '0100000000010300000001070000000118000000011221100';
    const invalidHash = '0120102102102';

    expect(await errorInvalidMetaHex(invalidHash, invalidMetaHex)).toBeTruthy();
  });

  test('error metadata not found', async () => {
    for (const id_ of Object.keys(prepared.programs)) {
      const program = prepared.programs[id_] as IPreparedProgram;
      if (!program.spec['pathToMetaTxt']) {
        expect(await errorMetaNotFound(genesis, id_)).toBeTruthy();
      }
    }
  });

  test('error state already exists', async () => {
    const programKey = Object.keys(prepared.programs)[0];
    const program = prepared.programs[programKey] as IPreparedProgram;
    const programStatesPath = program.spec.pathStates[0];

    expect(await errorStateAlreadyExists(genesis, program, programStatesPath)).toBeTruthy();
  });
});
