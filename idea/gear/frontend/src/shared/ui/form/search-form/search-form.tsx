import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { asOptionalField } from '@/shared/helpers';

import { Input } from '../input';

type Props<T extends z.ZodTypeAny> = {
  onSubmit: (query: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  getSchema?: (defaultSchema: z.ZodString) => T;
};

const FIELD_NAME = {
  QUERY: 'query',
} as const;

const DEFAULT_VALUES = {
  [FIELD_NAME.QUERY]: '',
} as const;

const QUERY_SCHEMA = z.string().trim();

const SearchForm = <T extends z.ZodTypeAny>({ placeholder, className, disabled, onSubmit, getSchema }: Props<T>) => {
  const schema = z.object({
    [FIELD_NAME.QUERY]: asOptionalField(getSchema ? getSchema(QUERY_SCHEMA) : QUERY_SCHEMA),
  });

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit((values) => onSubmit(values[FIELD_NAME.QUERY]));

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={className}>
        <Input name={FIELD_NAME.QUERY} type="search" placeholder={placeholder} disabled={disabled} />
      </form>
    </FormProvider>
  );
};

export { SearchForm };
