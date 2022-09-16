import { GearApi } from '@gear-js/api';
import * as gearHooks from '@gear-js/react-hooks';
import { Account } from '@gear-js/react-hooks';

import * as UseGasCalculateModule from 'hooks/useGasCalculate/useGasCalculate';

export const useAccountMock = (account?: Account, accounts?: Account[]) => {
  const mock = jest.spyOn(gearHooks, 'useAccount');

  mock.mockReturnValue({
    account,
    accounts,
    switchAccount: jest.fn(),
    logout: jest.fn(),
    isAccountReady: Boolean(accounts),
  });

  return mock;
};

export const useApiMock = (api?: any) => {
  jest.spyOn(GearApi, 'create').mockResolvedValue(api);

  const mock = jest.spyOn(gearHooks, 'useApi');

  mock.mockReturnValue({
    api,
    isApiReady: Boolean(api),
  });

  return mock;
};

export const useGasCalculateMock = (gasLimit: number) => {
  const mock = jest.spyOn(UseGasCalculateModule, 'useGasCalculate');

  const calculateGasMock = jest.fn().mockResolvedValue(gasLimit);

  mock.mockReturnValue(calculateGasMock);

  return { calculateGasMock };
};
