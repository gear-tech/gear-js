const { GearApi } = require('../lib');

const api = new GearApi();

beforeAll(async () => {
  await api.isReady;
});

afterAll(async () => {
  await api.disconnect();
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
});

describe('GearApi', () => {
  test('chain', async () => {
    expect(await api.chain()).toBeDefined();
  });

  test('nodeName', async () => {
    expect(await api.nodeName()).toBeDefined();
  });

  test('nodeVersion', async () => {
    expect(await api.nodeVersion()).toBeDefined();
  });

  test('totalIssuance', async () => {
    expect(await api.totalIssuance()).toBeDefined();
  });
});
