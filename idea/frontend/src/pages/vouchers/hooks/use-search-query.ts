import { useState } from 'react';
import { useForm } from 'react-hook-form';

const DEFAULT_SEARCH_VALUES = {
  query: '',
};

function useSearchQuery() {
  const [query, setQuery] = useState('');

  const { register, handleSubmit } = useForm({
    defaultValues: DEFAULT_SEARCH_VALUES,
  });

  const registerSearchInput = register('query');
  const handleSearchSubmit = handleSubmit((values) => setQuery(values.query));

  return [query, registerSearchInput, handleSearchSubmit] as const;
}

export { useSearchQuery };
