import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/config', async () => ({
  ...(await import('../src/shared/config/networks')),
  NODES_API_URL: 'https://nodes.example/networks.json',
  GENESIS: { MAINNET: 'mainnet-genesis' },
}));
vi.mock('../src/features/code-verifier/utils', () => ({ isCodeIdValid: () => true }));

import { getNodes } from '../src/api';
import { NETWORK_OPTIONS, SCHEMA } from '../src/features/code-verifier/components/verify-form/consts';

describe('Supported network presets', () => {
  it('filters retired remote presets and mixed sections while keeping other networks', async () => {
    const node = (address: string) => ({ address, isCustom: false });
    const mainnet = { caption: 'Vara', nodes: [node('wss://rpc.vara.network')] };
    const local = node('ws://127.0.0.1:9944');
    const hoodi = { caption: 'Hoodi', nodes: [node('wss://hoodi.example')] };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => [
          mainnet,
          { caption: 'Vara Testnet', nodes: [node('wss://unknown-rpc.example')] },
          { caption: 'development', nodes: [node('wss://testnet.vara.network'), local] },
          hoodi,
        ],
      }),
    );

    try {
      expect(await getNodes()).toEqual([mainnet, { caption: 'development', nodes: [local] }, hoodi]);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('removes testnet from code verification and rejects a stale network value', () => {
    expect(NETWORK_OPTIONS).toEqual([{ label: 'Mainnet', value: 'vara_mainnet' }]);
    const values = {
      version: 'latest',
      codeId: '0x01',
      repoLink: 'https://github.com/gear-tech/demo',
      projectIdType: 'root',
      projectId: '',
      basePath: '/',
      buildIdl: false,
    };
    expect(SCHEMA.safeParse({ ...values, network: 'vara_mainnet' }).success).toBe(true);
    expect(SCHEMA.safeParse({ ...values, network: 'vara_testnet' }).success).toBe(false);
  });
});
