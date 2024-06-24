import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_LIMIT, DNS_API_URL } from '@/shared/config';

import { getDns, getNextPageParam } from '../utils';
import { DnsFilterParams, DnsSortParams } from '../types';

function useDns(search: string, filterParams: DnsFilterParams, sortParams: DnsSortParams) {
  const url = DNS_API_URL;

  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['dns', search, filterParams, sortParams, url],
    queryFn: ({ pageParam }) =>
      getDns(url, { limit: DEFAULT_LIMIT, offset: pageParam, search, ...filterParams, ...sortParams }),
    initialPageParam: 0,
    getNextPageParam,
    enabled: Boolean(url),
  });

  const dns = data?.pages.flatMap((page) => page.data) || [];
  const dnsCount = data?.pages[0].count || 0;

  return [dns, dnsCount, isLoading, hasNextPage, fetchNextPage, refetch] as const;
}

export { useDns };
