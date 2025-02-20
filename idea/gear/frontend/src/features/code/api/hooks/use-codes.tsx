import { useInfiniteQuery } from '@tanstack/react-query';

import { INFINITE_QUERY } from '@/api';
import { useChain, useErrorAlert } from '@/hooks';

import { getCodes } from '../requests';
import { GetCodesParameters } from '../types';

function useCodes(parameters: GetCodesParameters) {
  const { isDevChain } = useChain();

  const query = useInfiniteQuery({
    queryKey: ['codes', parameters],
    queryFn: async ({ pageParam }) => (await getCodes({ ...parameters, offset: pageParam })).result,
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,
    enabled: !isDevChain,
  });

  useErrorAlert(query.error);

  return query;
}

export { useCodes };
