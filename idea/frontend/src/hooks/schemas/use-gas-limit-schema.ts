import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { z } from 'zod';

function useGasLimitSchema() {
  const { api, isApiReady } = useApi();
  const { getFormattedGasValue, getChainGasValue } = useBalanceFormat();

  const maxGasLimit = isApiReady ? api.blockGasLimit.toString() : '';
  const formattedMaxGasLimit = getFormattedGasValue(maxGasLimit).toFixed();

  return z
    .string()
    .trim()
    .transform((value) => getChainGasValue(value))
    .refine((value) => value.isGreaterThanOrEqualTo(0), { message: 'Minimum value is 0' })
    .refine((value) => value.isLessThanOrEqualTo(maxGasLimit), { message: `Maximum value is ${formattedMaxGasLimit}` })
    .transform((value) => value.toFixed());
}

export { useGasLimitSchema };
