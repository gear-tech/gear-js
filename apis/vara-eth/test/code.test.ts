import { createPublicClient, webSocket } from 'viem';

import { createVaraEthApi, HttpVaraEthProvider, type VaraEthApi } from '../src';
import { expectHex } from './common';
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

describe('Code query methods', () => {
  test('should return original code bytes as hex string', async () => {
    const code = await api.query.code.getOriginal(config.codeId);

    expectHex(code);
    expect(code.length).toBeGreaterThan(2);
  });
});
