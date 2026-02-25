import { createPublicClient, webSocket } from 'viem';

import { createVaraEthApi, VaraEthApi, HttpVaraEthProvider } from '../src';
import { config } from './config';

let provider: HttpVaraEthProvider;
let api: VaraEthApi;

beforeAll(async () => {
  const pc = createPublicClient({
    transport: webSocket(config.wsRpc),
  });
  provider = new HttpVaraEthProvider();
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
