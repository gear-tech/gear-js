const { GearKeyring, GearApi, DebugMode } = require('../lib');
const { sendTransaction } = require('./utilsFunctions');
const { readFileSync } = require('fs');

const api = new GearApi();
let alice;

jest.setTimeout(15000);

beforeAll(async () => {
  await api.isReady;
  alice = await GearKeyring.fromSuri('//Alice');
});

afterAll(async () => {
  await api.disconnect();
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
});

describe('DebugMode', () => {
  const debug = new DebugMode(api);

  test('enable debug mode', async () => {
    debug.enable();
    const transactionData = await sendTransaction(debug.enabled, alice, 'DebugMode');
    expect(transactionData).toBe(true);
  });

  test('get snapshots', async () => {
    const snapshot = {
      promise: undefined,
      resolve: undefined,
    };
    snapshot.promise = new Promise((resolve) => {
      snapshot.resolve = resolve;
    });
    const unsub = debug.snapshots((event) => {
      snapshot.resolve(event.data);
    });
    api.program.submit({
      code: readFileSync('test/wasm/demo_ping.opt.wasm'),
      gasLimit: 50_000_000,
    });
    await sendTransaction(api.program.submitted, alice, 'InitMessageEnqueued');

    const snapshotData = await snapshot.promise;
    (await unsub)();
    expect(snapshotData[0]).toHaveProperty('dispatchQueue');
    expect(snapshotData[0]).toHaveProperty('programs');
  });

  test('disable debug mode', async () => {
    debug.disable();
    const transactionData = await sendTransaction(debug.enabled, alice, 'DebugMode');
    expect(transactionData).toBe(false);
  });
});
