import { HexString } from '@gear-js/api';

import { rpcService } from '@/shared/services/rpcService';

const METHOD = {
  GET_TEST_BALANCE: 'testBalance.get',
  IS_TEST_BALANCE_AVAILABLE: 'testBalance.available',
} as const;

type GetTestBalanceParameters = {
  token: string;
  address: string;
};

const getIsTestBalanceAvailable = (genesis: HexString) =>
  rpcService.callRPC<boolean>(METHOD.IS_TEST_BALANCE_AVAILABLE, { genesis });

const getTestBalance = (params: GetTestBalanceParameters) => rpcService.callRPC(METHOD.GET_TEST_BALANCE, params);

export { getIsTestBalanceAvailable, getTestBalance };
