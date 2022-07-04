import * as gearHooks from '@gear-js/react-hooks';
import { Account } from '@gear-js/react-hooks';

export const useAccountMock = (account?: Account) => {
  const mock = jest.spyOn(gearHooks, 'useAccount');

  mock.mockReturnValue({
    account,
    switchAccount: jest.fn(),
    updateBalance: jest.fn(),
    logout: jest.fn(),
  });

  return mock;
};

export const useApiMock = (api?: any) => {
  const mock = jest.spyOn(gearHooks, 'useApi');

  mock.mockReturnValue({
    api,
    isApiReady: Boolean(api),
  });

  return mock;
};
