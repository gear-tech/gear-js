import { vi } from 'vitest';

vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');

  return {
    ...(actual as object),
    createPublicClient: vi.fn().mockImplementation(() => ({
      getChainId: vi.fn().mockResolvedValue(1),
      readContract: vi.fn().mockResolvedValue(18),
      simulateContract: vi.fn().mockImplementation(async ({ functionName, args, address }) => {
        return {
          request: {
            address,
            abi: (actual as any).parseAbi(['function transfer(address to, uint256 amount)']),
            functionName,
            args,
          },
        };
      }),
      waitForTransactionReceipt: vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          status: 'success',
          transactionHash: '0xmockhash',
          blockNumber: 123n,
        };
      }),
    })),
    createWalletClient: vi.fn().mockImplementation(() => ({
      writeContract: vi.fn().mockResolvedValue('0xmockhash'),
    })),
    webSocket: vi.fn().mockImplementation(() => ({})),
  };
});

vi.mock('viem/accounts', () => ({
  privateKeyToAccount: vi.fn().mockReturnValue({
    address: '0x0000000000000000000000000000000000000003',
  }),
}));
