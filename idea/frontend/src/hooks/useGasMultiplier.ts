import { useApi } from '@gear-js/react-hooks';
import { useBalanceMultiplier } from './useBalanceMultiplier';

function useGasMultiplier() {
  const { api, isApiReady } = useApi();
  const valuePerGas = isApiReady ? api.valuePerGas.toString() : '0';

  const { balanceMultiplier } = useBalanceMultiplier();
  const gasMultiplier = balanceMultiplier.dividedBy(valuePerGas);

  return gasMultiplier;
}

export { useGasMultiplier };
