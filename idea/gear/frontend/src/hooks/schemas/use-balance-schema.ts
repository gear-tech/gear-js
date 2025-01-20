import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { z } from 'zod';

function useBalanceSchema() {
  const { api } = useApi();
  const { getChainBalanceValue, getFormattedBalanceValue } = useBalanceFormat();

  const getBalanceSchema = () => {
    if (!api) throw new Error('API is not initialized');

    const decimals = api.registry.chainDecimals.toString();
    const existentialDeposit = api.existentialDeposit.toString();

    const minValueMessage = `Minimum value is 0 or ${getFormattedBalanceValue(existentialDeposit).toFixed()}`;
    const integerMessage = `Maximum amount of decimal places is ${decimals}`;

    return z
      .string()
      .transform((value) => getChainBalanceValue(value))
      .refine((value) => value.isEqualTo(0) || value.isGreaterThanOrEqualTo(existentialDeposit), minValueMessage)
      .refine((value) => value.isInteger(), integerMessage)
      .transform((value) => value.toFixed());
  };

  return getBalanceSchema();
}

export { useBalanceSchema };
