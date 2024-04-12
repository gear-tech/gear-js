import { useInfiniteQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '../consts';
import { getVouchers, getNextPageParam } from '../utils';
import { VouchersParams } from '../types';

type FilterParams = Partial<Pick<VouchersParams, 'declined' | 'expired' | 'owner' | 'spender'>>;

function useVouchers(id: string, filterParams: FilterParams) {
  const { data, isFetching, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['vouchers', id, filterParams],
    queryFn: ({ pageParam }) => getVouchers({ limit: PAGE_SIZE, offset: pageParam, id, ...filterParams }),
    initialPageParam: 0,
    getNextPageParam,
  });

  const vouchers = data?.pages.flatMap((page) => page.vouchers) || [];
  const vouchersCount = data?.pages[0].count || 0;

  return [vouchers, vouchersCount, isFetching, hasNextPage, fetchNextPage, refetch] as const;
}

export { useVouchers };
