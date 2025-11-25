jest.mock('viem', () => {
  const actual = jest.requireActual('viem');

  const waitForTransactionReceiptMock = jest.fn().mockImplementation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      status: 'success',
      transactionHash: '0xmockhash',
      blockNumber: 123n,
    };
  });

  const writeContractMock = jest.fn().mockResolvedValue('0xmockhash');

  const simulateContractMock = jest.fn().mockResolvedValue({
    request: {
      address: '0x0000000000000000000000000000000000000002',
      abi: actual.parseAbi(['function transfer(address to, uint256 amount)']),
      functionName: 'transfer',
      args: ['0x0000000000000000000000000000000000000001', 1000000000000000000n],
    },
  });

  const readContractMock = jest.fn().mockResolvedValue(18);

  const getChainIdMock = jest.fn().mockResolvedValue(1);

  return {
    ...actual,
    createPublicClient: jest.fn().mockImplementation(() => ({
      getChainId: getChainIdMock,
      readContract: readContractMock,
      simulateContract: simulateContractMock,
      waitForTransactionReceipt: waitForTransactionReceiptMock,
    })),
    createWalletClient: jest.fn().mockImplementation(() => ({
      writeContract: writeContractMock,
    })),
    webSocket: jest.fn().mockImplementation(() => ({})),
  };
});

jest.mock('viem/accounts', () => ({
  privateKeyToAccount: jest.fn().mockReturnValue({
    address: '0x0000000000000000000000000000000000000003',
  }),
}));
