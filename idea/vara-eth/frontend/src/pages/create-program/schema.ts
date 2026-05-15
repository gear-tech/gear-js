import { isAddress } from 'viem';
import { z } from 'zod';

const createProgramFormSchema = z
  .object({
    useExecutableBalance: z.boolean(),
    amount: z.string(),
    useAbiInterface: z.boolean(),
    abiInterface: z.string(),
    useOverrideInitializer: z.boolean(),
    overrideInitializer: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.useExecutableBalance) {
      const t = data.amount.trim();
      if (!t || Number.isNaN(Number(t)) || Number(t) <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Enter a positive amount',
          path: ['amount'],
        });
      }
    }

    if (data.useAbiInterface) {
      const t = data.abiInterface.trim();
      if (!t || !isAddress(t)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid address',
          path: ['abiInterface'],
        });
      }
    }

    if (data.useOverrideInitializer) {
      const t = data.overrideInitializer.trim();
      if (!t || !isAddress(t)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid address',
          path: ['overrideInitializer'],
        });
      }
    }
  });

type CreateProgramFormValues = z.infer<typeof createProgramFormSchema>;

const createProgramFormDefaultValues: CreateProgramFormValues = {
  useExecutableBalance: true,
  amount: '10',
  useAbiInterface: false,
  abiInterface: '',
  useOverrideInitializer: false,
  overrideInitializer: '',
};

export { type CreateProgramFormValues, createProgramFormDefaultValues, createProgramFormSchema };
