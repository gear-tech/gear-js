jest.mock('viem', () => {
  const actual = jest.requireActual('viem');

  return {
    ...actual,
    createPublicClient: jest.fn().mockImplementation(() => ({
      getChainId: jest.fn().mockResolvedValue(1),
      readContract: jest.fn().mockResolvedValue(18),
      simulateContract: jest.fn().mockImplementation(async ({ functionName, args, address }) => {
        return {
          request: {
            address,
            abi:
              functionName === 'mint'
                ? actual.parseAbi(['function mint(address to, uint256 amount)'])
                : actual.parseAbi(['function transfer(address to, uint256 amount)']),
            functionName,
            args,
          },
        };
      }),
      waitForTransactionReceipt: jest.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          status: 'success',
          transactionHash: '0xmockhash',
          blockNumber: 123n,
        };
      }),
    })),
    createWalletClient: jest.fn().mockImplementation(() => ({
      writeContract: jest.fn().mockResolvedValue('0xmockhash'),
    })),
    webSocket: jest.fn().mockImplementation(() => ({})),
  };
});

jest.mock('viem/accounts', () => ({
  privateKeyToAccount: jest.fn().mockReturnValue({
    address: '0x0000000000000000000000000000000000000003',
  }),
}));
