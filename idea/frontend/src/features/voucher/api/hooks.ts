import { useApi } from '@gear-js/react-hooks';
import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_LIMIT } from '@/shared/config';

import { API_URL } from './consts';
import { getVouchers, getNextPageParam } from './utils';
import { VouchersParameters } from './types';

function useVouchers(parameters: VouchersParameters) {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();
  const url = genesis ? API_URL[genesis as keyof typeof API_URL] : undefined;

  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['vouchers', url, parameters],
    queryFn: ({ pageParam }) => getVouchers(url!, { ...parameters, limit: DEFAULT_LIMIT, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam,
    enabled: Boolean(url),
  });

  const vouchers = data?.pages.flatMap((page) => page.vouchers) || [];
  const vouchersCount = data?.pages[0].count || 0;

  return [vouchers, vouchersCount, isLoading, hasNextPage, fetchNextPage, refetch] as const;
}

export { useVouchers };
