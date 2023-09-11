import { useApi } from '@gear-js/react-hooks';

import { useBalanceMultiplier } from './useBalanceMultiplier';

function useGasMultiplier() {
  const { api, isApiReady } = useApi();
  // '1000' is an old runtime fallback
  const valuePerGas = isApiReady ? api.valuePerGas?.toString() || '1000' : '0';

  const { balanceMultiplier } = useBalanceMultiplier();
  const gasMultiplier = balanceMultiplier.dividedBy(valuePerGas);

  // TODO: find a way to calculate logarithm without number
  const gasDecimals = Math.floor(Math.log10(gasMultiplier.toNumber()));

  return { gasMultiplier, gasDecimals };
}

export { useGasMultiplier };
