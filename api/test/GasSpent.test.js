const { readFileSync, fstat } = require('fs');
const { join } = require('path');
const { GearApi, GearKeyring } = require('../lib');
const { checkInit } = require('./utilsFunctions');

const EXAMPLES_DIR = 'test/wasm';
const api = new GearApi();
let alice = undefined;
let programId = undefined;
jest.setTimeout(15000);

beforeAll(async () => {
  await api.isReady;
  alice = await GearKeyring.fromSuri('//Alice');
  const code = readFileSync('test/wasm/demo_ping.wasm');
  programId = api.program.submit({ code, gasLimit: 200_000_000 }).programId;
  const initStatus = checkInit(api, programId);
  api.program.signAndSend(alice, () => {});
  expect(await initStatus).toBe('success');
});

afterAll(async () => {
  await api.disconnect();
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
});

test('Get init gas spent', async () => {
  expect(
    await api.program.gasSpent.init(
      GearKeyring.decodeAddress(alice.address),
      readFileSync(join(EXAMPLES_DIR, `demo_ping.opt.wasm`)),
      '0x50494e47',
      0,
    ),
  ).toBeDefined();
});

test('Get handle gas spent', async () => {
  expect(
    await api.program.gasSpent.handle(GearKeyring.decodeAddress(alice.address), programId, '0x50494e47', 0),
  ).toBeDefined();
});

test.todo('Get reply gas spent');
