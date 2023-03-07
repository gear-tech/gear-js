import { GearApi } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { waitReady } from '@polkadot/wasm-crypto';

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
} from './json-rpc.errors';

let genesis: HexString;
let prepared: IPrepared;
let api: GearApi;

describe('API methods', () => {
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

  describe('Program', () => {
    test('program.all request', async () => {
      expect(await getAllPrograms(genesis, Object.keys(prepared.programs) as HexString[])).toBeTruthy();
    });

    test('program.all by owner request', async () => {
      expect(await getAllProgramsByOwner(genesis, prepared.programs as IPreparedPrograms)).toBeTruthy();
    });

    test('program.all by status (active) request', async () => {
      expect(await getAllProgramsByStatus(genesis, 'active')).toBeTruthy();
    });

    test('program.all by status (terminated) request', async () => {
      expect(await getAllProgramsByStatus(genesis, 'terminated')).toBeTruthy();
    });

    test('program.all by dates request', async () => {
      const now = new Date();
      expect(await getAllProgramsByDates(genesis, now)).toBeTruthy();
    });

    test('program.data method', async () => {
      for (const id_ of Object.keys(prepared.programs)) {
        expect(await getProgramData(genesis, id_)).toBeTruthy();
      }
    });

    test('program.data method in batch request', async () => {
      expect(await getProgramDataInBatch(genesis, Object.keys(prepared.programs)[0])).toBeTruthy();
    });

    test('check if init status saved correctly', async () => {
      for (const id_ of Object.keys(prepared.programs)) {
        expect(await checkInitStatus(genesis, id_, prepared.programs[id_].init)).toBeTruthy();
      }
    });
  });

  describe('Metadata', () => {
    test('program.meta.add request', async () => {
      for (const id_ of Object.keys(prepared.programs)) {
        const program = prepared.programs[id_] as IPreparedProgram;

        if (program.spec['pathToMetaTxt']) {
          expect(await uploadMeta(genesis, program)).toBeTruthy();
        }
      }
    });

    test('program.meta.get request', async () => {
      for (const id_ of Object.keys(prepared.programs)) {
        const program = prepared.programs[id_] as IPreparedProgram;
        if (program.spec['pathToMetaTxt']) {
          expect(await getMeta(genesis, id_)).toBeTruthy();
        }
      }
    });
  });

  describe('State', () => {
    test('program.state.add request', async () => {
      for (const id_ of Object.keys(prepared.programs)) {
        const program = prepared.programs[id_] as IPreparedProgram;
        if (!program.spec['pathStates']) continue;

        const programStatesPath = program.spec.pathStates;
        for (const statePath of programStatesPath) {
          expect(await addState(genesis, program, statePath)).toBeTruthy();
        }
      }
    });

    test('program.state.all request', async () => {
      for (const id_ of Object.keys(prepared.programs)) {
        const program = prepared.programs[id_] as IPreparedProgram;
        if (!program.spec['pathStates']) continue;

        expect(await getStates(genesis, program)).toBeTruthy();
      }
    });

    test('program.state.all by function name request', async () => {
      for (const id_ of Object.keys(prepared.programs)) {
        const program = prepared.programs[id_] as IPreparedProgram;

        if (mapProgramStates.has(id_)) {
          const statesInDB = mapProgramStates.get(id_);

          for (const state of statesInDB) {
            const name = Object.keys(state.functions)[0];
            expect(await getStatesByFuncName(genesis, program, name)).toBeTruthy();
          }
        }
      }
    });

    test('program.state.get request', async () => {
      for (const id_ of Object.keys(prepared.programs)) {
        if (mapProgramStates.has(id_)) {
          const statesInDB = mapProgramStates.get(id_);

          for (const state of statesInDB) {
            expect(await getState(genesis, state)).toBeTruthy();
          }
        }
      }
    });
  });

  describe('Message', () => {
    test('message.all request', async () => {
      const messages = Array.from(prepared.messages.log.keys()).concat(
        Array.from(prepared.messages.sent.values()).map(({ id }) => id),
      ) as HexString[];
      Object.values(prepared.programs).forEach(({ messageId }) => messages.push(messageId));
      expect(await getAllMessages(genesis, messages)).toBeTruthy();
    });

    test('message.all by dates request', async () => {
      const now = new Date();
      expect(await getMessagesByDates(genesis, now)).toBeTruthy();
    });

    test('message.data request', async () => {
      for (const message of prepared.messages.log) {
        expect(await getMessageData(genesis, message[0])).toBeTruthy();
      }
      for (const [_, value] of prepared.messages.sent) {
        expect(await getMessagePayload(genesis, value.id));
      }
    });
  });

  describe('Code', () => {
    test('code.all request', async () => {
      await sleep();
      const codeIds = Array.from(prepared.collectionCode.keys());
      expect(await getCodes(genesis, codeIds)).toBeTruthy();
    });

    test('code.all by dates request', async () => {
      const now = new Date();
      expect(await getCodesByDates(genesis, now)).toBeTruthy();
    });

    test('code.data request', async () => {
      const codeIndex = 1;
      const codeId = Array.from(prepared.collectionCode.keys())[codeIndex];

      expect(await getCodeData(genesis, codeId)).toBeTruthy();
    });
  });

  describe('Test balance', () => {
    test('testBalance.get request', async () => {
      expect(await getTestBalance(genesis)).toBeTruthy();
    });

    test('several testBalance.get requests at a time', async () => {
      expect(await getTestBalanceSeveralTimesAtATime(genesis)).toBeTruthy();
    });

    test('testBalance.available request', async () => {
      expect(await testBalanceAvailable(genesis)).toBeTruthy();
    });
  });

  describe('Network', () => {
    test('networkData.available request', async () => {
      expect(await networkDataAvailable(genesis)).toBeTruthy();
    });

    test('blocks.status request', async () => {
      expect(await blocksStatus(genesis)).toBeTruthy();
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
      expect(await errorNoGenesisFound(genesis)).toBeTruthy();
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

    test('error message invalid meta hex', async () => {
      const programKey = Object.keys(prepared.programs)[0];
      const program = prepared.programs[programKey] as IPreparedProgram;
      const invalidMetaHex = '0100000000010300000001070000000118000000011221100';

      expect(await errorInvalidMetaHex(genesis, program.id, invalidMetaHex)).toBeTruthy();
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
});
