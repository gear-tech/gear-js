import { HexString } from '@gear-js/api';
import { useInfiniteQuery } from '@tanstack/react-query';

import { INFINITE_QUERY } from '@/api';

import { getVouchers } from '../requests';
import { VouchersParameters } from '../types';

type FilterParams = Partial<Pick<VouchersParameters, 'declined' | 'expired' | 'owner' | 'spender'>>;

function useVouchers(id: string, filterParams: FilterParams, programId?: HexString) {
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,
    queryKey: ['vouchers', id, filterParams, programId],
    queryFn: async ({ pageParam }) =>
      (
        await getVouchers({
          id,
          offset: pageParam,
          programs: programId ? [programId] : undefined,
          ...filterParams,
        })
      ).result,
  });

  return [data?.result || [], data?.count || 0, isLoading, hasNextPage, fetchNextPage, refetch] as const;
}

export { useVouchers };
