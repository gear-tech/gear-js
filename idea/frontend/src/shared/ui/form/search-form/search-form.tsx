import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '../input';

type Props = {
  onSubmit: (query: string) => void;
};

const DEFAULT_SEARCH_VALUES = {
  query: '',
};

const SearchForm = ({ onSubmit }: Props) => {
  const schema = z.object({
    query: z.string().trim(),
  });

  const form = useForm({
    defaultValues: DEFAULT_SEARCH_VALUES,
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit((values) => onSubmit(values.query));

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <Input name="query" type="search" placeholder="Search by id..." />
      </form>
    </FormProvider>
  );
};

export { SearchForm };
