jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers'); // подтягиваем всё остальное

  const waitMock = jest.fn().mockImplementation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      status: 1,
      hash: '0xmockhash',
      blockNumber: 123,
    };
  });

  const transferMock = jest.fn().mockResolvedValue({
    wait: waitMock,
  });

  const decimalsMock = jest.fn().mockResolvedValue(18);

  return {
    ...actual,
    BaseContract: {
      from: jest.fn().mockImplementation(() => ({
        transfer: transferMock,
        decimals: decimalsMock,
      })),
    },
    Wallet: jest.fn().mockImplementation(() => ({})),
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({
        name: 'test',
      }),
    })),
  };
});
