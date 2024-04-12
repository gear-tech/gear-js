import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '../input';

type Props<T> = {
  onSubmit: (query: string) => void;
  placeholder?: string;
  className?: string;
  getSchema?: (defaultSchema: z.ZodString) => z.ZodType<T>;
};

const FIELD_NAME = {
  QUERY: 'query',
} as const;

const DEFAULT_VALUES = {
  [FIELD_NAME.QUERY]: '',
} as const;

const QUERY_SCHEMA = z.string().trim();

const SearchForm = <T,>({ placeholder, className, onSubmit, getSchema }: Props<T>) => {
  const schema = z.object({
    [FIELD_NAME.QUERY]: (getSchema ? getSchema(QUERY_SCHEMA) : QUERY_SCHEMA).or(z.literal('')),
  });

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit((values) => onSubmit(values[FIELD_NAME.QUERY]));

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={className}>
        <Input name={FIELD_NAME.QUERY} type="search" placeholder={placeholder} />
      </form>
    </FormProvider>
  );
};

export { SearchForm };
