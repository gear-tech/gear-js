import type { DefaultError, QueryClient, QueryKey } from '@tanstack/query-core';
import {
  type DefinedInitialDataOptions,
  type DefinedUseQueryResult,
  type UndefinedInitialDataOptions,
  type UseQueryOptions,
  type UseQueryResult,
  useQuery as useTanstackQuery,
} from '@tanstack/react-query';

function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & { queryKey: TQueryKey };

function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & { queryKey: TQueryKey };

function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & { queryKey: TQueryKey };

function useQuery<TQueryFnData, TError, TData, TQueryKey extends QueryKey>(
  options:
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
):
  | (DefinedUseQueryResult<TData, TError> & { queryKey: TQueryKey })
  | (UseQueryResult<TData, TError> & { queryKey: TQueryKey }) {
  const result = useTanstackQuery(options, queryClient) as
    | (DefinedUseQueryResult<TData, TError> & { queryKey: TQueryKey })
    | (UseQueryResult<TData, TError> & { queryKey: TQueryKey });

  result.queryKey = options.queryKey;

  return result;
}

export { useQuery };
