import { describe, expect, it } from 'vitest';

import {
  isRetiredVaraTestnet,
  LOCAL_ENDPOINT,
  MAINNET_ENDPOINT,
  RETIRED_VARA_TESTNET_GENESIS,
  resolveInitialNetwork,
} from '../src/shared/config/networks';

describe('Network selection after Substrate testnet retirement', () => {
  const resolve = (overrides = {}) =>
    resolveInitialNetwork({
      savedNode: null,
      savedGenesis: null,
      defaultEndpoint: MAINNET_ENDPOINT,
      ...overrides,
    });

  it.each([
    'wss://testnet.vara.network',
    'wss://testnet.vara-network.io:443/path',
    'wss://VARA-TESTNET.example.org',
    'vara_testnet',
    'Vara Testnet',
    'testnet Vara',
    encodeURIComponent('wss://testnet.vara.network'),
    encodeURIComponent(encodeURIComponent('wss://testnet.vara-network.io')),
  ])('recognizes retired URLs and identifiers: %s', (address) => {
    expect(isRetiredVaraTestnet(address)).toBe(true);
    expect(resolve({ urlNode: address }).requiresSelection).toBe(true);
    expect(resolve({ savedNode: address }).requiresSelection).toBe(true);
    expect(resolve({ defaultEndpoint: address }).requiresSelection).toBe(true);
  });

  it('requires a choice when a saved custom RPC previously resolved to the retired genesis', () => {
    expect(
      resolve({ savedNode: 'wss://custom.example', savedGenesis: RETIRED_VARA_TESTNET_GENESIS }).requiresSelection,
    ).toBe(true);
    expect(resolve({ savedGenesis: RETIRED_VARA_TESTNET_GENESIS }).requiresSelection).toBe(true);
  });

  it.each([
    MAINNET_ENDPOINT,
    LOCAL_ENDPOINT,
    'wss://testnet.vara.eth',
    'wss://hoodi.example',
  ])('preserves an explicit supported URL: %s', (endpoint) => {
    expect(isRetiredVaraTestnet(endpoint)).toBe(false);
    expect(resolve({ urlNode: endpoint, savedGenesis: RETIRED_VARA_TESTNET_GENESIS })).toEqual({
      endpoint,
      requiresSelection: false,
    });
  });

  it('does not replace a retired URL with mainnet or a saved local node', () => {
    const result = resolve({ urlNode: 'wss://testnet.vara.network', savedNode: LOCAL_ENDPOINT });
    expect(result).toEqual({ endpoint: 'wss://testnet.vara.network', requiresSelection: true });
  });
});
