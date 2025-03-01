import { useInfiniteQuery } from '@tanstack/react-query';

import { INFINITE_QUERY } from '@/api';
import { useChain, useErrorAlert } from '@/hooks';

import { getEvents } from '../requests';
import { GetEventsParameters } from '../types';

function useEvents(parameters: GetEventsParameters) {
  const { isDevChain } = useChain();

  const query = useInfiniteQuery({
    queryKey: ['events', parameters],
    queryFn: async ({ pageParam }) => (await getEvents({ ...parameters, offset: pageParam })).result,
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,
    enabled: !isDevChain,
  });

  useErrorAlert(query.error);

  return query;
}

export { useEvents };
