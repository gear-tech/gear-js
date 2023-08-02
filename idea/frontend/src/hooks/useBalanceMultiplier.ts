import { useApi } from '@gear-js/react-hooks';
import BigNumber from 'bignumber.js';

function useBalanceMultiplier() {
  const { api, isApiReady } = useApi();

  // ready check for header transfer balance,
  // since it renders after account is ready
  const [decimals] = isApiReady ? api.registry.chainDecimals : [0];

  return BigNumber(10).exponentiatedBy(BigNumber(decimals));
}

export { useBalanceMultiplier };
