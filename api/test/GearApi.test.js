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

describe('Blocks', () => {
  test('get hash of the first block', async () => {
    expect(await api.blocks.getBlockHash(1)).toBeDefined();
  });

  test('get events of the first block', async () => {
    expect(await api.blocks.getEvents(await api.blocks.getBlockHash(1))).toBeDefined();
  });

  test('get extrinsics of the first block', async () => {
    expect(await api.blocks.getExtrinsics(await api.blocks.getBlockHash(1))).toBeDefined();
  });

  test('get finalized head', async () => {
    expect(await api.blocks.getFinalizedHead()).toBeDefined();
  });

  test('get block number by hash', async () => {
    const hash = await api.blocks.getBlockHash(1);
    const blockNumber = await api.blocks.getBlockNumber(hash.toHex());
    expect(blockNumber.toNumber()).toBe(1);
  });
});
