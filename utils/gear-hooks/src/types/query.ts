import { UseQueryOptions } from '@tanstack/react-query';

type QueryParameters<TQueryFnData, TData> = {
  query?: Omit<UseQueryOptions<TQueryFnData, Error, TData, (string | undefined)[]>, 'queryKey' | 'queryFn'>;
};

export type { QueryParameters };
