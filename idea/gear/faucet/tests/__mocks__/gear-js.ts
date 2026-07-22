import type { BN } from '@polkadot/util';
import { vi } from 'vitest';

export const gearMockState = {
  transferMode: 'success' as
    | 'success'
    | 'asyncSuccess'
    | 'callbackError'
    | 'duplicateFinal'
    | 'extrinsicFailed'
    | 'missingTransfer'
    | 'lateUnsubscribe'
    | 'omitTxHash'
    | 'submitFailed',
  freeBalance: '100000000000000000',
  lastTransferAddress: '',
  reconciliationMode: 'notFound' as 'notFound' | 'success' | 'extrinsicFailed' | 'missingTransfer',
  reconciliationTxHash: '0xRECONCILE',
  reconciliationAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  genesisHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
  disconnectFails: false,
  reset() {
    this.transferMode = 'success';
    this.freeBalance = '100000000000000000';
    this.lastTransferAddress = '';
    this.reconciliationMode = 'notFound';
    this.reconciliationTxHash = '0xRECONCILE';
    this.genesisHash = '0x1111111111111111111111111111111111111111111111111111111111111111';
    this.disconnectFails = false;
  },
};

vi.mock('@gear-js/api', async () => {
  const actual = await vi.importActual('@gear-js/api');

  const mockToHex = vi.fn(() => gearMockState.genesisHash);

  let _address: string;

  const createSingleTransferTx = (addr: string) => ({
    hash: { toHex: () => '0xTX' },
    signAndSend: vi.fn().mockImplementation((_account, callback) => {
      if (gearMockState.transferMode === 'submitFailed') {
        return Promise.reject(new Error('submit failed'));
      }

      const finalizedEvents =
        gearMockState.transferMode === 'extrinsicFailed'
          ? [{ event: { method: 'ExtrinsicFailed', data: {} } }]
          : gearMockState.transferMode === 'missingTransfer'
            ? []
            : [
                {
                  event: {
                    method: 'Transfer',
                    data: { to: { toHex: () => addr }, amount: { toString: () => '50000000000000' } },
                  },
                },
              ];

      const txHash = gearMockState.transferMode === 'omitTxHash' ? {} : { txHash: { toHex: () => '0xTX' } };
      const inBlockResult = {
        ...txHash,
        events: [],
        status: { isInBlock: true, asInBlock: { toHex: () => '0xINBLOCK' } },
      };
      const finalizedResult = {
        ...txHash,
        events: gearMockState.transferMode === 'missingTransfer' ? undefined : finalizedEvents,
        status: { isFinalized: true, asFinalized: { toHex: () => '0xFINALIZED' } },
      };
      const emit = () => {
        callback(inBlockResult);
        if (gearMockState.transferMode === 'callbackError') return;
        callback(finalizedResult);
        if (gearMockState.transferMode === 'duplicateFinal') callback(finalizedResult);
      };

      if (gearMockState.transferMode === 'asyncSuccess') setTimeout(emit, 0);
      else emit();

      if (gearMockState.transferMode === 'lateUnsubscribe') {
        return new Promise((resolve) => setTimeout(() => resolve(vi.fn()), 500));
      }
      return Promise.resolve(vi.fn());
    }),
  });

  const mockTx = {
    balances: {
      transferKeepAlive: vi.fn((addr: string, _amount: BN) => {
        _address = addr;
        gearMockState.lastTransferAddress = addr;
        return createSingleTransferTx(addr);
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
      disconnect: vi.fn().mockImplementation(() =>
        gearMockState.disconnectFails ? Promise.reject(new Error('disconnect failed')) : Promise.resolve(),
      ),
      on: vi.fn(),
      genesisHash: { toHex: mockToHex },
      chain: vi.fn().mockResolvedValue('Vara Local'),
      query: {
        system: {
          account: vi.fn().mockImplementation(async () => ({ data: { free: { toString: () => gearMockState.freeBalance } } })),
          events: {
            at: vi.fn().mockImplementation(async () => {
              if (gearMockState.reconciliationMode === 'notFound') return [];
              const event =
                gearMockState.reconciliationMode === 'extrinsicFailed'
                  ? { method: 'ExtrinsicFailed', data: {} }
                  : gearMockState.reconciliationMode === 'missingTransfer'
                    ? { method: 'ExtrinsicSuccess', data: {} }
                    : {
                        method: 'Transfer',
                        data: {
                          to: { toHex: () => gearMockState.reconciliationAddress },
                          amount: { toString: () => '50000000000000' },
                        },
                      };
              return [{ phase: { isApplyExtrinsic: true, asApplyExtrinsic: { toNumber: () => 0 } }, event }];
            }),
          },
        },
      },
      rpc: {
        chain: {
          getFinalizedHead: vi.fn().mockResolvedValue({ toHex: () => '0xFINALIZED_HEAD' }),
          getHeader: vi.fn().mockResolvedValue({ number: { toNumber: () => 10 } }),
          getBlockHash: vi.fn().mockImplementation(async (number: number) => ({ toHex: () => `0xBLOCK${number}` })),
          getBlock: vi.fn().mockImplementation(async (blockHash: { toHex: () => string }) => ({
            block: {
              extrinsics:
                gearMockState.reconciliationMode !== 'notFound' && blockHash.toHex() === '0xBLOCK10'
                  ? [{ hash: { toHex: () => gearMockState.reconciliationTxHash } }]
                  : [],
            },
          })),
        },
      },
      getExtrinsicFailedError: vi.fn(() => ({ docs: ['Mocked error docs'] })),
    };
  });

  return {
    ...(actual as object),
    GearApi,
  };
});
