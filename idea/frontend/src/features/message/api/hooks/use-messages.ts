import { useInfiniteQuery } from '@tanstack/react-query';

import { INFINITE_QUERY } from '@/api';
import { useChain, useErrorAlert } from '@/hooks';

import { getMessagesFromProgram, getMessagesToProgram } from '../requests';
import { MessagesFromProgramParameters, MessagesToProgramParameters } from '../types';

function useMessagesToProgram(parameters: MessagesToProgramParameters, enabled: boolean) {
  const { isDevChain } = useChain();

  const query = useInfiniteQuery({
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,

    queryKey: ['messagesToProgram', parameters, isDevChain],
    queryFn: async () => {
      // TODO: separate into standalone hook
      if (isDevChain) return { result: [], count: 0 };

      return (await getMessagesToProgram(parameters)).result;
    },
    enabled,
  });

  useErrorAlert(query.error);

  return query;
}

function useMessagesFromProgram(parameters: MessagesFromProgramParameters, enabled: boolean) {
  const { isDevChain } = useChain();

  const query = useInfiniteQuery({
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,

    queryKey: ['messagesFromProgram', parameters, isDevChain],
    queryFn: async () => {
      // TODO: separate into standalone hook
      if (isDevChain) return { result: [], count: 0 };

      return (await getMessagesFromProgram(parameters)).result;
    },
    enabled,
  });

  useErrorAlert(query.error);

  return query;
}

export { useMessagesToProgram, useMessagesFromProgram };
