import type { HexString } from '@gear-js/api';
import { getDefaultPayloadValue, getPayloadSchema } from '@gear-js/sails-payload-form';
import { useMemo } from 'react';
import type { z } from 'zod';

import type { ParsedSails } from '../../types';

import { useSelect } from './use-select';

function useConstructor(program: ParsedSails) {
  const ctors = program.ctors ?? {};

  const select = useSelect(ctors, { label: 'Constructor' });
  const { args, encodePayload } = ctors[select.value] ?? { args: [], encodePayload: () => '0x' as const };

  const defaultValues = useMemo(() => getDefaultPayloadValue(program, args), [program, select.value]);

  const schema = useMemo(
    () =>
      getPayloadSchema(program, undefined, args, encodePayload).transform(
        (value: { encoded: HexString }) => value.encoded,
      ) as z.ZodType<HexString>,
    [program, select.value],
  );

  return { select, args, defaultValues, schema };
}

export { useConstructor, useSelect };
