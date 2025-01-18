import { useMemo } from 'react';
import { Sails } from 'sails-js';

import { getDefaultPayloadValue, getPayloadSchema } from '../../utils';
import { useSelect } from './use-select';

function useConstructor(sails: Sails) {
  const { ctors } = sails;

  const select = useSelect(ctors, { label: 'Constructor' });
  const { args, encodePayload } = ctors[select.value];

  const defaultValues = useMemo(
    () => getDefaultPayloadValue(sails, args),
     
    [select.value],
  );

  const schema = useMemo(
    () => getPayloadSchema(sails, args, encodePayload),
     
    [select.value],
  );

  return { select, args, defaultValues, schema };
}

export { useConstructor, useSelect };
