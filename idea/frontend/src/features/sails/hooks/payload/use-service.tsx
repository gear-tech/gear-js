import { useState, ChangeEvent, useMemo } from 'react';
import { Sails } from 'sails-js';

import { getDefaultPayloadValue, getPayloadSchema } from '../../utils';

function useService(sails: Sails) {
  const { services } = sails;

  const names = Object.keys(services);
  const options = names.map((name) => ({ label: name, value: name }));

  const [name, setName] = useState(names[0]);
  const { functions } = services[name];

  const functionNames = Object.keys(functions);
  const functionOptions = functionNames.map((_name) => ({ label: _name, value: _name }));

  const [functionName, setFunctionName] = useState(functionNames[0]);
  const { args, encodePayload } = functions[functionName];

  const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    setName(target.value);
    setFunctionName(Object.keys(services[target.value].functions)[0]);
  };

  const handleFunctionChange = ({ target }: ChangeEvent<HTMLSelectElement>) => setFunctionName(target.value);

  const defaultValues = useMemo(
    () => getDefaultPayloadValue(sails, args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, functionName],
  );

  const schema = useMemo(
    () => getPayloadSchema(sails, args, encodePayload),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, functionName],
  );

  const select = { options, value: name, handleChange };
  const functionSelect = { options: functionOptions, value: functionName, handleChange: handleFunctionChange };

  return { select, functionSelect, defaultValues, schema, args };
}

export { useService };
