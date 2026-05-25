import type { BN } from '@polkadot/util';
import { vi } from 'vitest';

vi.mock('@gear-js/api', async () => {
  const actual = await vi.importActual('@gear-js/api');

  const mockToHex = vi.fn(() => '0xGENESIS');

  let _address: string;

  const mockTx = {
    balances: {
      transferKeepAlive: vi.fn((addr: string, _amount: BN) => {
        _address = addr;
        return `tx-${addr}`;
      }),
    },
    utility: {
      forceBatch: vi.fn(() => ({
        signAndSend: vi.fn().mockImplementation((_account, callback) => {
          const mockEvents = [
            { event: { method: 'Transfer', data: { to: { toHex: () => _address } } } },
            { event: { method: 'ExtrinsicSuccess' } },
          ];

          const status = {
            isInBlock: true,
            asInBlock: { toHex: () => '0xBLOCK' },
          };

          setTimeout(() => {
            callback({ events: mockEvents, status });
          }, 1000);

          return Promise.resolve();
        }),
      })),
    },
  };

  // biome-ignore lint/complexity/useArrowFunction: needed for test correctness
  const GearApi = vi.fn().mockImplementation(function () {
    return {
      tx: mockTx,
      isReady: Promise.resolve(),
      isReadyOrError: Promise.resolve(),
      disconnect: vi.fn(),
      on: vi.fn(),
      genesisHash: { toHex: mockToHex },
      chain: vi.fn().mockResolvedValue('Vara Local'),
      getExtrinsicFailedError: vi.fn(() => ({ docs: ['Mocked error docs'] })),
    };
  });

  return {
    ...(actual as object),
    GearApi,
  };
});
