import { useState, ChangeEvent, useMemo } from 'react';
import { Sails } from 'sails-js';

import { getDefaultPayloadValue, getPayloadSchema } from '../../utils';

function useConstructor(sails: Sails) {
  const { ctors } = sails;

  const names = Object.keys(ctors);
  const options = names.map((name) => ({ label: name, value: name }));

  const [name, setName] = useState<string>(names[0]);
  const { args } = ctors[name];

  const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => setName(target.value);

  const defaultValues = useMemo(
    () => getDefaultPayloadValue(sails, args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
  );

  const schema = useMemo(
    () => getPayloadSchema(sails, args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
  );

  const select = { options, value: name, handleChange };

  return { select, args, defaultValues, schema };
}

export { useConstructor };
