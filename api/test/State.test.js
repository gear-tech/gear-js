const { GearApi, GearKeyring, getWasmMetadata } = require('../lib');
const { readFileSync } = require('fs');
const { join } = require('path');
const { checkInit } = require('./utilsFunctions.js');
const { TEST_WASM_DIR } = require('./config');

const api = new GearApi();
const demo_meta_test = {
  code: readFileSync(join(TEST_WASM_DIR, 'demo_meta.opt.wasm')),
  meta: readFileSync(join(TEST_WASM_DIR, 'demo_meta.meta.wasm')),
  id: undefined,
};
const timestamp_test = {
  code: readFileSync('test/spec/state/timestamp.opt.wasm'),
  meta: readFileSync('test/spec/state/timestamp.meta.wasm'),
  id: undefined,
};

beforeAll(async () => {
  await api.isReady;
  const alice = await GearKeyring.fromSuri('//Alice');

  timestamp_test.id = api.program.submit({
    code: timestamp_test.code,
    gasLimit: 200_000_000,
  }).programId;
  let initStatus = checkInit(api, timestamp_test.id);
  api.program.signAndSend(alice, () => {});
  expect(await initStatus).toBe('success');

  demo_meta_test.id = api.program.submit(
    {
      code: demo_meta_test.code,
      initPayload: { amount: 8, currency: 'GRT' },
      gasLimit: 200_000_000,
    },
    await getWasmMetadata(demo_meta_test.meta),
  ).programId;
  initStatus = checkInit(api, demo_meta_test.id);
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

describe('Read State', () => {
  test('Test call timestamp in meta_state', async () => {
    const state = await api.programState.read(timestamp_test.id, timestamp_test.meta);
    expect(state).toBeDefined();
  });

  test('Tests read demo_meta state with None input', async () => {
    const state = await api.programState.read(demo_meta_test.id, demo_meta_test.meta, null);
    expect(state.toHex()).toBe(
      '0x08010000000000000004012c536f6d655375726e616d6520536f6d654e616d6502000000000000000402244f746865724e616d65304f746865725375726e616d65',
    );
  });

  test('Tests read demo_meta state with Some input', async () => {
    const state = await api.programState.read(demo_meta_test.id, demo_meta_test.meta, { decimal: 1, hex: [1] });
    expect(state.toHex()).toBe('0x04010000000000000004012c536f6d655375726e616d6520536f6d654e616d65');
  });
});
