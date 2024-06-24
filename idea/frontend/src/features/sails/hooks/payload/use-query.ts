import { useState, ChangeEvent, useMemo } from 'react';
import { Sails } from 'sails-js';

import { getDefaultPayloadValue, getPayloadSchema } from '../../utils';

// TODO: almost same as useService, merge them
function useQuery(sails: Sails) {
  const { services } = sails;

  const names = Object.keys(services);
  const options = names.map((name) => ({ label: name, value: name }));

  const [name, setName] = useState(names[0]);
  const { queries } = services[name];

  const functionNames = Object.keys(queries);
  const functionOptions = functionNames.map((_name) => ({ label: _name, value: _name }));

  const [functionName, setFunctionName] = useState(functionNames[0]);
  const { args, encodePayload, decodePayload } = queries[functionName];

  const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    setName(target.value);
    setFunctionName(Object.keys(services[target.value].queries)[0]);
  };

  const handleFunctionChange = ({ target }: ChangeEvent<HTMLSelectElement>) => setFunctionName(target.value);

  const defaultValues = useMemo(
    () => (sails && args ? getDefaultPayloadValue(sails, args) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, functionName],
  );

  const schema = useMemo(
    () => (sails && args && encodePayload ? getPayloadSchema(sails, args, encodePayload) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, functionName],
  );

  const select = { options, value: name, handleChange };
  const functionSelect = { options: functionOptions, value: functionName, handleChange: handleFunctionChange };

  return { select, functionSelect, defaultValues, schema, args, decodePayload };
}

export { useQuery };
