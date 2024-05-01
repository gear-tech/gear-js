import { useApi } from '@gear-js/react-hooks';
import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_LIMIT, VOUCHERS_API_URL } from '@/shared/config';

import { getVouchers, getNextPageParam } from '../utils';
import { VouchersParams } from '../types';

type FilterParams = Partial<Pick<VouchersParams, 'declined' | 'expired' | 'owner' | 'spender'>>;

function useVouchers(id: string, filterParams: FilterParams) {
  const { api } = useApi();
  const genesis = api?.genesisHash.toHex();
  const url = genesis ? VOUCHERS_API_URL[genesis as keyof typeof VOUCHERS_API_URL] : undefined;

  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['vouchers', id, filterParams, url],
    queryFn: ({ pageParam }) => getVouchers(url!, { limit: DEFAULT_LIMIT, offset: pageParam, id, ...filterParams }),
    initialPageParam: 0,
    getNextPageParam,
    enabled: Boolean(url),
  });

  const vouchers = data?.pages.flatMap((page) => page.vouchers) || [];
  const vouchersCount = data?.pages[0].count || 0;

  return [vouchers, vouchersCount, isLoading, hasNextPage, fetchNextPage, refetch] as const;
}

export { useVouchers };
