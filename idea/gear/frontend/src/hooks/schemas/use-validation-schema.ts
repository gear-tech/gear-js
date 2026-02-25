import { z } from 'zod';

import { useBalanceSchema } from './use-balance-schema';
import { useGasLimitSchema } from './use-gas-limit-schema';

function useValidationSchema() {
  const balanceSchema = useBalanceSchema();
  const gasLimitSchema = useGasLimitSchema();

  return z.looseObject({
    value: balanceSchema,
    gasLimit: gasLimitSchema,
    payloadType: z.string().trim().min(1, 'This field is required'),
  });
}

export { useValidationSchema };
