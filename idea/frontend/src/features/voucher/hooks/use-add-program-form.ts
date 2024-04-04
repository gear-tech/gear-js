import { HexString } from '@gear-js/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useProgramIdSchema } from './use-program-id-schema';

const INPUT_NAME = {
  PROGRAM_ID: 'id',
  PROGRAM_IDS: 'ids',
} as const;

type Values = {
  [INPUT_NAME.PROGRAM_ID]: string;
  [INPUT_NAME.PROGRAM_IDS]: Record<'value', HexString>[];
};

type FormattedValues = {
  [INPUT_NAME.PROGRAM_ID]: HexString;
  [INPUT_NAME.PROGRAM_IDS]: Record<'value', HexString>[];
};

const DEFAULT_VALUES: Values = {
  [INPUT_NAME.PROGRAM_ID]: '',
  [INPUT_NAME.PROGRAM_IDS]: [] as Record<'value', HexString>[],
} as const;

function useAddProgramForm() {
  const idSchema = useProgramIdSchema();
  const idsSchema = z.array(z.object({ value: z.string() }));

  const schema = z
    .object({
      [INPUT_NAME.PROGRAM_ID]: idSchema,
      [INPUT_NAME.PROGRAM_IDS]: idsSchema,
    })
    .refine(({ id, ids }) => !ids.some(({ value }) => value === id), {
      message: 'Value already exists',
      path: [INPUT_NAME.PROGRAM_ID],
    });

  const form = useForm<Values, unknown, FormattedValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: INPUT_NAME.PROGRAM_IDS,
  });

  return { form, fieldArray } as const;
}

export { useAddProgramForm };
