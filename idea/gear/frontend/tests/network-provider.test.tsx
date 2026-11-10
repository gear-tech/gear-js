import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LOCAL_ENDPOINT, MAINNET_ENDPOINT, RETIRED_VARA_TESTNET_GENESIS } from '../src/shared/config/networks';

const state = vi.hoisted(() => ({ requiresSelection: false, endpoint: '', genesis: '' }));
const connect = vi.hoisted(() => vi.fn());

vi.mock('@/features/api', () => ({
  get INITIAL_ENDPOINT() {
    return state.endpoint;
  },
  get REQUIRES_NETWORK_SELECTION() {
    return state.requiresSelection;
  },
}));
vi.mock('@/shared/config', async () => import('../src/shared/config/networks'));
vi.mock('@gear-js/react-hooks', () => ({
  ApiProvider: ({ initialArgs, children }: { initialArgs: { endpoint: string }; children: ReactNode }) => {
    connect(initialArgs);
    return children;
  },
  useApi: () => ({ api: { genesisHash: { toHex: () => state.genesis } } }),
}));
vi.mock('../src/app/providers/api/network-selection', () => ({
  NetworkSelection: () => <p>Select a supported network</p>,
}));

import { ApiProvider } from '../src/app/providers/api/Provider';

describe('Application network gate', () => {
  beforeEach(() => {
    connect.mockClear();
    state.requiresSelection = false;
    state.genesis = 'supported-genesis';
  });

  it('does not create a connection or mount write controls for a retired saved/URL selection', () => {
    state.requiresSelection = true;
    state.endpoint = 'wss://testnet.vara.network';
    const html = renderToStaticMarkup(
      <ApiProvider>
        <button type="button">Send transaction</button>
      </ApiProvider>,
    );
    expect(html).toContain('Select a supported network');
    expect(html).not.toContain('Send transaction');
    expect(connect).not.toHaveBeenCalled();
  });

  it('blocks the application when a custom RPC resolves to the retired genesis', () => {
    state.endpoint = 'wss://custom.example';
    state.genesis = RETIRED_VARA_TESTNET_GENESIS;
    const html = renderToStaticMarkup(
      <ApiProvider>
        <button type="button">Send transaction</button>
      </ApiProvider>,
    );
    expect(html).toContain('Select a supported network');
    expect(html).not.toContain('Send transaction');
    expect(connect).toHaveBeenCalledExactlyOnceWith({ endpoint: state.endpoint });
  });

  it.each([
    MAINNET_ENDPOINT,
    LOCAL_ENDPOINT,
  ])('connects to the explicitly selected supported endpoint %s', (endpoint) => {
    state.endpoint = endpoint;
    const html = renderToStaticMarkup(
      <ApiProvider>
        <p>Application</p>
      </ApiProvider>,
    );
    expect(html).toContain('Application');
    expect(connect).toHaveBeenCalledExactlyOnceWith({ endpoint });
  });
});
