import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { INFINITE_QUERY } from '@/api';
import { useLocalPrograms } from '@/features/local-indexer';
import { useChain, useErrorAlert } from '@/hooks';

import { getPrograms, getProgramsBatch } from '../requests';
import { Program, ProgramsParameters } from '../types';

function usePrograms(parameters: ProgramsParameters, enabled = true) {
  const { isDevChain } = useChain();
  const { getLocalPrograms } = useLocalPrograms();

  const query = useInfiniteQuery({
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,

    queryKey: ['programs', parameters],
    queryFn: async ({ pageParam }) =>
      (await (isDevChain ? getLocalPrograms : getPrograms)({ ...parameters, offset: pageParam })).result,
    enabled,
  });

  useErrorAlert(query.error);

  return query;
}

function useProgramsBatch(parameters: ProgramsParameters[], enabled: boolean) {
  const selectBatch = useCallback(
    (data: Awaited<ReturnType<typeof getProgramsBatch>>) =>
      data.reduce(
        (acc, { result }) => {
          acc.result.push(...result.result);
          acc.count += result.count;

          return acc;
        },
        { result: [] as Program[], count: 0 },
      ),
    [],
  );

  const query = useQuery({
    queryKey: ['programs-batch', parameters],
    queryFn: () => getProgramsBatch(parameters),
    select: selectBatch,
    enabled,
  });

  useErrorAlert(query.error);

  return query;
}

export { usePrograms, useProgramsBatch };
