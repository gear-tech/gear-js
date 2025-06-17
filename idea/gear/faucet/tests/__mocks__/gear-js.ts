jest.mock('@gear-js/api', () => {
  const actual = jest.requireActual('@gear-js/api');

  const mockToHex = jest.fn(() => '0xGENESIS');

  let _address: string;

  const mockTx = {
    balances: {
      transferKeepAlive: jest.fn((addr: string, amount: BN) => {
        _address = addr;
        return `tx-${addr}`;
      }),
    },
    utility: {
      forceBatch: jest.fn(() => ({
        signAndSend: jest.fn().mockImplementation((account, callback) => {
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

  const GearApi = jest.fn().mockImplementation(({ providerAddress }) => ({
    tx: mockTx,
    isReady: Promise.resolve(),
    isReadyOrError: Promise.resolve(),
    disconnect: jest.fn(),
    on: jest.fn(),
    genesisHash: { toHex: mockToHex },
    chain: jest.fn().mockResolvedValue('Vara Local'),
    getExtrinsicFailedError: jest.fn(() => ({ docs: ['Mocked error docs'] })),
  }));

  return {
    ...actual,
    GearApi,
  };
});

import { BN } from '@polkadot/util';
