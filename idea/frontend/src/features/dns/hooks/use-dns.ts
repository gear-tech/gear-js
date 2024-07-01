import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_LIMIT } from '@/shared/config';

import { getDns, getNextPageParam } from '../utils';
import { DnsFilterParams, DnsSortParams } from '../types';

function useDns(search: string, filterParams: DnsFilterParams, sortParams: DnsSortParams) {
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['dns', search, filterParams, sortParams],
    queryFn: ({ pageParam }) =>
      getDns({ limit: DEFAULT_LIMIT, offset: pageParam, search, ...filterParams, ...sortParams }),
    initialPageParam: 0,
    getNextPageParam,
  });

  const dns = data?.pages.flatMap((page) => page.data) || [];
  const dnsCount = data?.pages[0].count || 0;

  return [dns, dnsCount, isLoading, hasNextPage, fetchNextPage, refetch] as const;
}

export { useDns };
