import { createPublicClient, webSocket } from 'viem';

import { createVaraEthApi, HttpVaraEthProvider, type VaraEthApi } from '../src';
import { expectBlockRequestEvent, expectHex, expectStateTransition } from './common';
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
  test('should return block header with correct field types', async () => {
    const header = await api.query.block.header();

    expectHex(header.hash);
    expect(typeof header.height).toBe('number');
    expect(typeof header.timestamp).toBe('number');
    expectHex(header.parentHash);
  });

  test('should return block events array with correct shapes', async () => {
    const events = await api.query.block.events();

    expect(Array.isArray(events)).toBe(true);

    for (const event of events) {
      expectBlockRequestEvent(event);
    }
  });

  test('should return state transitions array with correct field types', async () => {
    const outcome = await api.query.block.outcome();

    expect(Array.isArray(outcome)).toBe(true);

    for (const transition of outcome) {
      expectStateTransition(transition);
    }
  });
});
