const { GearKeyring, GearApi } = require('../lib');

let api;
let alice;

beforeAll(async () => {
  api = await GearApi.create();
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

describe('Get extrinsic errors', () => {
  test('send incorrect transaction', async () => {
    const submitted = api.tx.gear.submitProgram('0x123456', '0x123', '0x00', 1000, 0);
    const error = await new Promise((resolve) => {
      submitted.signAndSend(alice, ({ events = [] }) => {
        events.forEach(({ event }) => {
          if (api.events.system.ExtrinsicFailed.is(event)) {
            resolve(api.getExtrinsicFailedError(event));
          }
        });
      });
    });
    expect(error.docs.join(' ')).toBe('Failed to create a program.');
    expect(error.method).toBe('FailedToConstructProgram');
    expect(error.name).toBe('FailedToConstructProgram');
  });
});
