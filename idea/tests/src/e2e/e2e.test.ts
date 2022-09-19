import { GearApi, Hex } from '@gear-js/api';
import { waitReady } from '@polkadot/wasm-crypto';

import { checkInitStatus, getAllPrograms, getMeta, getProgramData, uploadMeta } from './programs';
import { processPrepare } from '../prepare';
import { IPrepared, IPreparedProgram } from '../interfaces';
import { sleep } from '../utils';
import { getAllMessages, getMessageData, getMessagePayload } from './messages';
import { getTestBalance, testBalanceAvailable } from './testBalance';
import { getCodeData, getListCode } from './code';
import base from '../config/base';

let genesis: Hex;
let prepared: IPrepared;
let api: GearApi;

jest.setTimeout(30_000);

beforeAll(async () => {
  // api = await GearApi.create({ providerAddress: base.gear.wsProvider });
  api = await GearApi.create({ });
  genesis = api.genesisHash.toHex();
  await waitReady();
  try {
    prepared = await processPrepare(api);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});

afterAll(async (done) => {
  await api.disconnect();
  await sleep();
  done();
});

describe('program methods', () => {
  test('program.all request', async () => {
    expect(await getAllPrograms(genesis, Object.keys(prepared.programs) as Hex[])).toBeTruthy();
  });

  test('program.meta.add request', async () => {
    for (const id_ of Object.keys(prepared.programs)) {
      const program = prepared.programs[id_] as IPreparedProgram;
      expect(await uploadMeta(genesis, program)).toBeTruthy();
    }
  });

  test('program.meta.get request', async () => {
    for (const id_ of Object.keys(prepared.programs)) {
      expect(await getMeta(genesis, id_)).toBeTruthy();
    }
  });

  test('program.data method', async () => {
    for (const id_ of Object.keys(prepared.programs)) {
      expect(await getProgramData(genesis, id_)).toBeTruthy();
    }
  });

  test('check if init status saved correctly', async () => {
    for (const id_ of Object.keys(prepared.programs)) {
      expect(await checkInitStatus(genesis, id_, prepared.programs[id_].init)).toBeTruthy();
    }
  });
});

describe('message methods', () => {
  test('message.all request', async () => {
    const messages = Array.from(prepared.messages.log.keys()).concat(
      Array.from(prepared.messages.sent.values()).map(({ id }) => id),
    ) as Hex[];
    Object.values(prepared.programs).forEach(({ messageId }) => messages.push(messageId));
    expect(await getAllMessages(genesis, messages)).toBeTruthy();
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

describe('code methods', () => {
  test('code.all request', async () => {
    const codeIds = Array.from(prepared.collectionCode.keys());
    expect(await getListCode(genesis, codeIds)).toBeTruthy();
  });

  test('code.data request', async () => {
    const codeIndex = 0;
    const codeId = Array.from(prepared.collectionCode.keys())[codeIndex];
    expect(await getCodeData(genesis, codeId)).toBeTruthy();
  });
});

describe('testBalance', () => {
  test('testBalance.get request', async () => {
    expect(await getTestBalance(genesis)).toBeTruthy();
  });
  test('testBalance.available request', async () => {
    expect(await testBalanceAvailable(genesis)).toBeTruthy();
  });
});
