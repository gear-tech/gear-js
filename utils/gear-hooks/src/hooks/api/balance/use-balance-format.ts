import { BigNumber } from 'bignumber.js';
import { useContext } from 'react';
import { ApiContext } from 'context';
import { formatBalance } from '@polkadot/util';

function useBalanceFormat() {
  const { api, isApiReady } = useContext(ApiContext); // сircular dependency fix

  const [decimals] = isApiReady ? api.registry.chainDecimals : [0];
  const valuePerGas = isApiReady ? api.valuePerGas.toString() : '1000';

  const balanceMultiplier = new BigNumber(10).exponentiatedBy(decimals);

  const getChainBalanceValue = (value: string | number) => new BigNumber(value).multipliedBy(balanceMultiplier);

  const getFormattedBalanceValue = (value: string | number) => new BigNumber(value).dividedBy(balanceMultiplier);

  const getChainGasValue = (value: string | number) =>
    new BigNumber(value).multipliedBy(balanceMultiplier).dividedBy(valuePerGas).integerValue(BigNumber.ROUND_UP);

  const getFormattedGasValue = (value: string | number) =>
    new BigNumber(value).multipliedBy(valuePerGas).dividedBy(balanceMultiplier);

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
    getChainBalanceValue,
    getChainGasValue,
    getFormattedBalanceValue,
    getFormattedGasValue,
    getFormattedBalance,
  };
}

export { useBalanceFormat };
