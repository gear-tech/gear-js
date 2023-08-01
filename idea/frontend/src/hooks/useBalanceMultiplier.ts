import { useApi } from '@gear-js/react-hooks';
import BigNumber from 'bignumber.js';

function useBalanceMultiplier() {
  const { api } = useApi();
  const [decimals] = api.registry.chainDecimals;

  return BigNumber(10).exponentiatedBy(BigNumber(decimals));
}

export { useBalanceMultiplier };
