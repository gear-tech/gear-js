import { useInfiniteQuery } from '@tanstack/react-query';

import { INFINITE_QUERY } from '@/api';
import { useLocalPrograms } from '@/features/local-indexer';
import { useChain, useErrorAlert } from '@/hooks';

import { getPrograms } from '../requests';
import { ProgramsParameters } from '../types';

function usePrograms(parameters: ProgramsParameters) {
  const { isDevChain } = useChain();
  const { getLocalPrograms } = useLocalPrograms();

  const query = useInfiniteQuery({
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,

    queryKey: ['programs', parameters],
    queryFn: async ({ pageParam }) =>
      (await (isDevChain ? getLocalPrograms : getPrograms)({ ...parameters, offset: pageParam })).result,
  });

  useErrorAlert(query.error);

  return query;
}

export { usePrograms };
