import { GearApi, Hex } from '@gear-js/api';
import { waitReady } from '@polkadot/wasm-crypto';
import { getAllPrograms, getMeta, getProgramData, uploadMeta } from './programs';
import base from '../config/base';
import { processPrepare } from '../prepare';
import { IPrepared, IPreparedProgram } from '../interfaces';
import { sleep } from '../utils';

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

describe('Main', () => {
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
});
