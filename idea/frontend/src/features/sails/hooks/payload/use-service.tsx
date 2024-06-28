import { useMemo } from 'react';
import { Sails } from 'sails-js';

import { getDefaultPayloadValue, getPayloadSchema } from '../../utils';
import { useSelect } from './use-select';

function useService(sails: Sails, key: 'functions' | 'queries') {
  const { services } = sails;

  const handleSelectChange = (value: string) => {
    const [defaultFunction] = Object.keys(services[value][key]);

    functionSelect.setValue(defaultFunction);
  };

  const select = useSelect(services, handleSelectChange);

  const functions = services[select.value][key];
  const functionSelect = useSelect(functions);
  const { args, encodePayload, decodePayload } = functions[functionSelect.value];

  const defaultValues = useMemo(
    () => getDefaultPayloadValue(sails, args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [select.value, functionSelect.value],
  );

  const schema = useMemo(
    () => getPayloadSchema(sails, args, encodePayload),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [select.value, functionSelect.value],
  );

  return { select, functionSelect, defaultValues, schema, args, decodePayload };
}

export { useService };
