import { GearApi, Hex } from '@gear-js/api';
import { waitReady } from '@polkadot/wasm-crypto';
import { getAllPrograms, uploadMeta } from './programs';
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
    test('getAllProgram', async () => {
        expect(getAllPrograms(genesis, Object.keys(prepared.programs) as Hex[])).resolves.not.toThrowError();
    });

    test('upload meta', async () => {
        for (let id_ of Object.keys(prepared.programs)) {
            const program = prepared.programs[id_] as IPreparedProgram;
            if (program.spec.pathToMeta) {
                expect(await uploadMeta(genesis, program)).resolves.not.toThrowError();
            }
        }
    });
});
