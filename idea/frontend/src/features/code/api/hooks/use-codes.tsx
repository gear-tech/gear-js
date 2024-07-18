import { useInfiniteQuery } from '@tanstack/react-query';

import { INFINITE_QUERY } from '@/api';
import { useErrorAlert } from '@/hooks';

import { GetCodesParameters } from '../types';
import { getCodes } from '../requests';

function useCodes(parameters: GetCodesParameters) {
  const query = useInfiniteQuery({
    queryKey: ['codes', parameters],
    queryFn: async () => (await getCodes(parameters)).result,
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,
  });

  useErrorAlert(query.error);

  return query;
}

export { useCodes };
