import { useApi } from '@gear-js/react-hooks';
import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_LIMIT } from '@/shared/config';

import { getDns, getNextPageParam } from '../utils';
import { DnsFilterParams } from '../types';

function useDns(search: string, filterParams: DnsFilterParams) {
  const { api, isApiReady } = useApi();

  const getQuery = (offset: number) => {
    if (!isApiReady) throw new Error('API is not initialized');
    const genesis = api.genesisHash.toHex();

    return getDns({ limit: DEFAULT_LIMIT, offset, search, genesis, ...filterParams });
  };

  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['dns', search, filterParams],
    queryFn: ({ pageParam }) => getQuery(pageParam),
    initialPageParam: 0,
    getNextPageParam,
    enabled: isApiReady,
  });

  const dns = data?.pages.flatMap((page) => page.data) || [];
  const dnsCount = data?.pages[0].count || 0;

  return [dns, dnsCount, isLoading, hasNextPage, fetchNextPage, refetch] as const;
}

export { useDns };
