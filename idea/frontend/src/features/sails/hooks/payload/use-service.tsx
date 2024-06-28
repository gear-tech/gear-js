import { ChangeEvent, useMemo } from 'react';
import { Sails } from 'sails-js';

import { getDefaultPayloadValue, getPayloadSchema } from '../../utils';
import { useSelect } from './use-select';

function useService(sails: Sails, key: 'functions' | 'queries') {
  const { services } = sails;

  const onSelectChange = (value: string) => {
    const [defaultFunction] = Object.keys(services[value][key]);

    functionSelect.onChange({ target: { value: defaultFunction } } as ChangeEvent<HTMLSelectElement>);
  };

  const select = useSelect(services, { onChange: onSelectChange, label: 'Service' });

  const functions = services[select.value][key];
  const functionSelect = useSelect(functions, { label: key === 'functions' ? 'Function' : 'Query' });
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
