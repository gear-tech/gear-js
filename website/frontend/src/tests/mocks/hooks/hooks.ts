import * as hooks from 'hooks';
import { Account } from 'context/types';

export const useAccountMock = (account?: Account) => {
  const mock = jest.spyOn(hooks, 'useAccount');

  mock.mockReturnValue({
    account,
    switchAccount: jest.fn(),
    updateBalance: jest.fn(),
    logout: jest.fn(),
  });

  return mock;
};

export const useApiMock = (api?: any) => {
  const mock = jest.spyOn(hooks, 'useApi');

  mock.mockReturnValue({
    api,
    isApiReady: Boolean(api),
  });

  return mock;
};
