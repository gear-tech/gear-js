import { createPublicClient, webSocket } from 'viem';

import { createVaraEthApi, VaraEthApi, WsVaraEthProvider } from '../src';
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
  test('get header', async () => {
    const header = await api.query.block.header();

    expect(header).toHaveProperty(['hash']);
    expect(header).toHaveProperty(['height']);
    expect(header).toHaveProperty(['timestamp']);
    expect(header).toHaveProperty(['parentHash']);
  });
});
