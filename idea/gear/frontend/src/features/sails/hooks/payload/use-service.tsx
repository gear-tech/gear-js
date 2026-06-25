import type { HexString } from '@gear-js/api';
import { getDefaultPayloadValue, getPayloadSchema } from '@gear-js/sails-payload-form';
import { type ChangeEvent, useMemo } from 'react';
import type { QueryBuilder, QueryBuilderWithHeader } from 'sails-js';
import type { z } from 'zod';

import { isAnyKey } from '@/shared/helpers';

import type { ParsedSails } from '../../types';

import { useSelect } from './use-select';

function useService(program: ParsedSails, key: 'functions' | 'queries') {
  const { services } = program;

  const onSelectChange = (value: string) => {
    const [defaultFunction] = Object.keys(services[value][key]);

    functionSelect.onChange({ target: { value: defaultFunction } } as ChangeEvent<HTMLSelectElement>);
  };

  const nonEmptyServices = Object.fromEntries(Object.entries(services).filter(([, service]) => isAnyKey(service[key])));

  const select = useSelect(nonEmptyServices, { onChange: onSelectChange, label: 'Service' });

  const serviceName = select.value;
  const serviceMethods = services[serviceName][key];
  const functionSelect = useSelect(serviceMethods, { label: key === 'functions' ? 'Function' : 'Query' });
  const { args, encodePayload } = serviceMethods[functionSelect.value];

  const defaultValues = useMemo(
    () => getDefaultPayloadValue(program, args, serviceName),
    [program, serviceName, select.value, functionSelect.value],
  );

  const schema = useMemo(
    () =>
      getPayloadSchema(program, serviceName, args, encodePayload).transform(
        (value: { encoded: HexString }) => value.encoded,
      ) as z.ZodType<HexString>,
    [program, serviceName, select.value, functionSelect.value],
  );

  const callQuery =
    key === 'queries'
      ? async (payload: Record<string, unknown>, address?: string) => {
          const queryFn = serviceMethods[functionSelect.value] as (
            ...queryArgs: unknown[]
          ) => QueryBuilderWithHeader<unknown> | QueryBuilder<unknown>;

          const queryArgs = args.map((_, index) => payload[index]);
          const builder = queryFn(...queryArgs);
          if (address) builder.withAddress(address);

          return builder.call();
        }
      : undefined;

  return { select, functionSelect, defaultValues, schema, args, serviceName, callQuery };
}

export { useService };
