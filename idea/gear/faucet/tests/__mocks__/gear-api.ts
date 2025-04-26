import { BN } from '@polkadot/util';

const mockToHex = jest.fn(() => '0xGENESIS');

const mockTx = {
  balances: {
    transferKeepAlive: jest.fn((addr: string, amount: BN) => `tx-${addr}`),
  },
  utility: {
    forceBatch: jest.fn(() => ({
      signAndSend: jest.fn().mockImplementation((account, callback) => {
        // Пример: вызовем callback с моком событий
        const mockEvents = [
          { event: { method: 'Transfer', data: { to: { toHex: () => '0xADDR1' } } } },
          { event: { method: 'ExtrinsicSuccess' } },
        ];

        const status = {
          isInBlock: true,
          asInBlock: { toHex: () => '0xBLOCK' },
        };

        callback({ events: mockEvents, status });

        return Promise.resolve();
      }),
    })),
  },
};

export const GearApi = jest.fn().mockImplementation(({ providerAddress }) => ({
  tx: mockTx,
  isReady: Promise.resolve(),
  isReadyOrError: Promise.resolve(),
  disconnect: jest.fn(),
  on: jest.fn(),
  genesisHash: { toHex: mockToHex },
  chain: jest.fn().mockResolvedValue('Vara Local'),
  getExtrinsicFailedError: jest.fn(() => ({ docs: ['Mocked error docs'] })),
}));

export const GearKeyring = {
  fromSeed: jest.fn().mockResolvedValue({ mock: 'seedAccount' }),
  fromSuri: jest.fn().mockResolvedValue({ mock: 'suriAccount' }),
  fromMnemonic: jest.fn().mockResolvedValue({ mock: 'mnemonicAccount' }),
};

export const __mocks__ = {
  mockTx,
};
