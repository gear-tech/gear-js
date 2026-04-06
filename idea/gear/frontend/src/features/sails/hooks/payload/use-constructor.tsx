import { getDefaultPayloadValue, getPayloadSchema } from '@gear-js/sails-payload-form';
import { useMemo } from 'react';
import type { Sails } from 'sails-js';

import { useSelect } from './use-select';

function useConstructor(sails: Sails) {
  const { ctors } = sails;

  const select = useSelect(ctors, { label: 'Constructor' });
  const { args, encodePayload } = ctors[select.value];

  const defaultValues = useMemo(() => getDefaultPayloadValue(sails, args), [select.value]);

  const schema = useMemo(
    () => getPayloadSchema(sails, args, encodePayload).transform((value) => value.encoded),
    [select.value],
  );

  return { select, args, defaultValues, schema };
}

export { useConstructor, useSelect };
