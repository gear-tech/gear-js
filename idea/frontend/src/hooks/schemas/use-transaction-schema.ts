import { z } from 'zod';

import { getPayloadSchema } from '@/features/sails/utils';

import { useBalanceSchema } from './use-balance-schema';
import { useGasLimitSchema } from './use-gas-limit-schema';

function useTransactionSchema(payloadSchema: ReturnType<typeof getPayloadSchema>) {
  const balanceSchema = useBalanceSchema();
  const gasLimitSchema = useGasLimitSchema();

  return z.object({
    payload: payloadSchema,
    value: balanceSchema,
    gasLimit: gasLimitSchema,
    programName: z.string().trim().min(1),
    keepAlive: z.boolean(),
  });
}

export { useTransactionSchema };
