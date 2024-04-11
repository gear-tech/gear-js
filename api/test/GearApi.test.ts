import { GearApi } from '../src';
import { WS_ADDRESS } from './config';
import { sleep } from './utilsFunctions';

const api = new GearApi({ providerAddress: WS_ADDRESS });

beforeAll(async () => {
  try {
    await api.isReadyOrError;
  } catch (error) {
    process.exit(1);
  }
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('GearApi', () => {
  test('chain', async () => {
    expect(await api.chain()).toBe('Development');
  });

  test('nodeName', async () => {
    expect(await api.nodeName()).toBe('Gear Node');
  });

  test('runtimeChain', async () => {
    expect(api.runtimeChain.toHuman()).toBe('Development');
  });

  test('genesisHash', async () => {
    expect(api.genesisHash).toBeDefined();
  });

  test('nodeVersion', async () => {
    expect(await api.nodeVersion()).toBeDefined();
  });

  test('totalIssuance', async () => {
    expect(await api.totalIssuance()).toBeDefined();
  });

  test('existentialDeposit', () => {
    expect(api.existentialDeposit).toBeDefined();
  });

  test('mailboxTreshold', () => {
    expect(api.mailboxTreshold).toBeDefined();
  });

  test('waitlistCost', () => {
    expect(api.waitlistCost).toBeDefined();
  });

  test('wasmBlobVersion', async () => {
    const version = await api.wasmBlobVersion();
    expect(version).toBeDefined();
  });

  test('valuePerGas', () => {
    expect(api.valuePerGas).toBeDefined();
  });

  test.skip('inflationInfo', async () => {
    const info = await api.inflationInfo();
    expect(info.inflation.toBigInt()).toBeDefined();
    expect(info.roi.toBigInt()).toBeDefined();
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

  test('get block by block number', async () => {
    expect(await api.blocks.get(1)).toBeDefined();
  });

  test('get block timestamp', async () => {
    expect(await api.blocks.getBlockTimestamp(1)).toBeDefined();
  });

  test('get block number by hash', async () => {
    const hash = await api.blocks.getBlockHash(1);
    const blockNumber = await api.blocks.getBlockNumber(hash.toHex());
    expect(blockNumber.toNumber()).toBe(1);
  });

  test('subscribe heads from', async () => {
    const blocks: number[] = [];

    const unsub = await api.blocks.subscribeToHeadsFrom(1, (header) => {
      if (blocks.includes(header.number.toNumber())) throw new Error('Block already exists in the array');
      blocks.push(header.number.toNumber());
    });

    await sleep(7_000);

    unsub();

    for (let i = 1; i < Math.max(...blocks); i++) {
      expect(blocks).toContain(i);
    }
  });
});

describe('Runtime consts', () => {
  test('blockGasLimit', () => {
    expect(api.blockGasLimit).not.toBeUndefined();
  });
});
