import { GearApi, Hex } from '@gear-js/api';
import { waitReady } from '@polkadot/wasm-crypto';
import { getAllPrograms, getMeta, getProgramData, uploadMeta } from './programs';
import base from '../config/base';
import { processPrepare } from '../prepare';
import { IPrepared, IPreparedProgram } from '../interfaces';
import { sleep } from '../utils';
import { getAllMessages, getMessageData } from './messages';

let genesis: Hex;
let prepared: IPrepared;
let api: GearApi;

jest.setTimeout(30000);

beforeAll(async () => {
  api = await GearApi.create({ providerAddress: base.gear.wsProvider });
  genesis = api.genesisHash.toHex();
  prepared = await processPrepare(api);
  await waitReady();
});

afterAll(async () => {
  await api.disconnect();
  await sleep();
});

describe('program methods', () => {
  test('program.all request', async () => {
    expect(await getAllPrograms(genesis, Object.keys(prepared.programs) as Hex[])).toBeTruthy();
  });

  test('program.meta.add request', async () => {
    for (let id_ of Object.keys(prepared.programs)) {
      const program = prepared.programs[id_] as IPreparedProgram;
      expect(await uploadMeta(genesis, program)).toBeTruthy();
    }
  });

  test('program.meta.get request', async () => {
    for (let id_ of Object.keys(prepared.programs)) {
      expect(await getMeta(genesis, id_)).toBeTruthy();
    }
  });

  test('program.data method', async () => {
    for (let id_ of Object.keys(prepared.programs)) {
      expect(await getProgramData(genesis, id_)).toBeTruthy();
    }
  });

  test.todo('test init status');
});

describe('message methods', () => {
  test('message.all request', async () => {
    const messages = Array.from(prepared.messages.log.keys()).concat(
      Array.from(prepared.messages.sent.values()).map(({ messageId }) => messageId),
    ) as Hex[];
    Object.values(prepared.programs).forEach(({ messageId }) => messages.push(messageId));
    expect(await getAllMessages(genesis, messages)).toBeTruthy();
  });

  test('message.data request', async () => {
    for (let message of prepared.messages.log) {
      expect(await getMessageData(genesis, message[0])).toBeTruthy();
    }
  });
});
