import { Metadata } from '@gear-js/api';

import * as UseProgramModule from 'hooks/useProgram';
import * as hooks from 'hooks';
import { Account } from 'context/types';
import { ProgramModel } from 'types/program';

export const useProgramMock = (program?: ProgramModel) => {
  const mock = jest.spyOn(UseProgramModule, 'useProgram');

  const meta: string | undefined = program?.meta?.meta;
  const parsedMeta = meta ? (JSON.parse(meta) as Metadata) : void 0;

  mock.mockReturnValue([program, parsedMeta]);

  return mock;
};

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

export const useAlertMock = () => {};
