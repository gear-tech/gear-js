import { HexString } from '@gear-js/api';
import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_LIMIT } from '@/shared/config';

import { VouchersParams } from '../types';
import { getVouchers } from '../requests';
import { INFINITE_QUERY } from '@/api';

type FilterParams = Partial<Pick<VouchersParams, 'declined' | 'expired' | 'owner' | 'spender'>>;

function useVouchers(id: string, filterParams: FilterParams, programId?: HexString) {
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    queryKey: ['vouchers', id, filterParams, programId],
    queryFn: async ({ pageParam }) =>
      (
        await getVouchers({
          limit: DEFAULT_LIMIT,
          offset: pageParam,
          programs: programId ? [programId] : undefined,
          id: id as HexString,
          ...filterParams,
        })
      ).result,
  });

  const vouchers = data?.pages.flatMap((page) => page.result) || [];
  const vouchersCount = data?.pages[0].count || 0;

  return [vouchers, vouchersCount, isLoading, hasNextPage, fetchNextPage, refetch] as const;
}

export { useVouchers };
