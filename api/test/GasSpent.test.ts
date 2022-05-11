import { readFileSync, fstat } from 'fs';
import { join } from 'path';
import { GearApi, GearKeyring } from '../src';
import { GEAR_EXAMPLES_WASM_DIR } from './config';
import { checkInit, getAccount, sleep } from './utilsFunctions';

const api = new GearApi();
let alice = undefined;
let aliceRaw = undefined;
let programId = undefined;
jest.setTimeout(15000);

beforeAll(async () => {
  await api.isReady;
  [alice] = await getAccount();
  aliceRaw = GearKeyring.decodeAddress(alice.address);
  const code = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_ping.wasm'));
  programId = api.program.submit({ code, gasLimit: 200_000_000 }).programId;
  const initStatus = checkInit(api, programId);
  api.program.signAndSend(alice, () => {});
  expect(await initStatus).toBe('success');
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

test('Get init gas spent', async () => {
  expect(
    await api.program.gasSpent.init(
      aliceRaw,
      readFileSync(join(GEAR_EXAMPLES_WASM_DIR, `demo_ping.opt.wasm`)),
      '0x50494e47',
      0,
    ),
  ).toBeDefined();
});

test('Get handle gas spent', async () => {
  expect(await api.program.gasSpent.handle(aliceRaw, programId, '0x50494e47', 0)).toBeDefined();
});

test('Get gas spent if payload is U8a', async () => {
  const payload = new Uint8Array([80, 73, 78, 71]);
  expect(await api.program.gasSpent.handle(aliceRaw, programId, payload, 0)).toBeDefined();
});

test.todo('Get reply gas spent');
