const { GearApi } = require('@gear-js/api');

const api = new GearApi();

describe('GearApi', () => {
  test('chain', async () => {
    await api.isReady;
    expect(await api.chain()).toBeDefined();
  });

  test('nodeName', async () => {
    await api.isReady;
    expect(await api.nodeName()).toBeDefined();
  });

  test('nodeVersion', async () => {
    await api.isReady;
    expect(await api.nodeVersion()).toBeDefined();
  });

  test('totalIssuance', async () => {
    await api.isReady;
    expect(await api.totalIssuance()).toBeDefined();
  });
});
