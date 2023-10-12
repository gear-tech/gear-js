import BigNumber from 'bignumber.js';
import { useContext, useMemo } from 'react';
import { ApiContext } from 'context';
import { formatBalance } from '@polkadot/util';

function useBalanceFormat() {
  const { api, isApiReady } = useContext(ApiContext); // сircular dependency fix

  const [decimals] = isApiReady ? api.registry.chainDecimals : [0];
  const balanceMultiplier = BigNumber(10).exponentiatedBy(BigNumber(decimals));

  const valuePerGas = useMemo(() => {
    try {
      if (!isApiReady) throw new Error('API is not initialized');

      return api.valuePerGas.toString();
    } catch {
      return '1000';
    }
  }, [api]);

  const gasMultiplier = balanceMultiplier.dividedBy(valuePerGas);

  // TODO: find a way to calculate logarithm without number
  const gasDecimals = useMemo(() => Math.floor(Math.log10(gasMultiplier.toNumber())), [gasMultiplier]);

  const getChainValue = (value: string | number, multiplier: BigNumber) => BigNumber(value).multipliedBy(multiplier);
  const getFormattedValue = (value: string | number, multiplier: BigNumber) => BigNumber(value).dividedBy(multiplier);

  const getChainBalanceValue = (value: string | number) => getChainValue(value, balanceMultiplier);
  const getChainGasValue = (value: string | number) => getChainValue(value, gasMultiplier);

  const getFormattedBalanceValue = (value: string | number) => getFormattedValue(value, balanceMultiplier);
  const getFormattedGasValue = (value: string | number) => getFormattedValue(value, gasMultiplier);

  const getFormattedBalance = (balance: Exclude<Parameters<typeof formatBalance>[0], undefined>) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const [unit] = api.registry.chainTokens;

    const value = formatBalance(balance, {
      decimals,
      forceUnit: unit,
      withSiFull: false,
      withSi: false,
      withUnit: unit,
    });

    return { value, unit };
  };

  return {
    balanceMultiplier,
    decimals,
    gasMultiplier,
    gasDecimals,
    getChainBalanceValue,
    getChainGasValue,
    getFormattedBalanceValue,
    getFormattedGasValue,
    getFormattedBalance,
  };
}

export { useBalanceFormat };
