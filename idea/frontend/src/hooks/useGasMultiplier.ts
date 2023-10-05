import { useApi } from '@gear-js/react-hooks';
import { useMemo } from 'react';

import { useBalanceMultiplier } from './useBalanceMultiplier';

function useGasMultiplier() {
  const { api, isApiReady } = useApi();

  // '1000' is an old runtime fallback
  const valuePerGas = useMemo(() => {
    try {
      if (!isApiReady) throw new Error('API is not initialized');

      return api.valuePerGas.toString();
    } catch {
      return '1000';
    }
  }, [api, isApiReady]);

  const { balanceMultiplier } = useBalanceMultiplier();
  const gasMultiplier = balanceMultiplier.dividedBy(valuePerGas);

  // TODO: find a way to calculate logarithm without number
  const gasDecimals = Math.floor(Math.log10(gasMultiplier.toNumber()));

  return { gasMultiplier, gasDecimals };
}

export { useGasMultiplier };
