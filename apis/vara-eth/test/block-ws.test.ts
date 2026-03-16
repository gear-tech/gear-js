import { createPublicClient, webSocket } from 'viem';

import { createVaraEthApi, VaraEthApi, WsVaraEthProvider } from '../src';
import { expectHex } from './common';
import { config } from './config';

let provider: WsVaraEthProvider;
let api: VaraEthApi;

beforeAll(async () => {
  provider = new WsVaraEthProvider();
  const pc = createPublicClient({
    transport: webSocket(config.wsRpc),
  });
  api = await createVaraEthApi(provider, pc, config.routerId);
});

afterAll(async () => {
  await provider.disconnect();
});

describe('Block methods', () => {
  test('should return block header with correct field types', async () => {
    const header = await api.query.block.header();

    expectHex(header.hash);
    expect(typeof header.height).toBe('number');
    expect(typeof header.timestamp).toBe('number');
    expectHex(header.parentHash);
  });
});
