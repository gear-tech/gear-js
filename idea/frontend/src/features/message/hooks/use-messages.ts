import { useInfiniteQuery } from '@tanstack/react-query';

import { INFINITE_QUERY } from '@/api';
import { useErrorAlert } from '@/hooks';

import {
  getMessagesFromProgram,
  getMessagesToProgram,
  MessagesToProgramParameters,
  MessagesFromProgramParameters,
} from '../api';

function useMessagesToProgram(parameters: MessagesToProgramParameters, enabled: boolean) {
  const query = useInfiniteQuery({
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,

    queryKey: ['messagesToProgram', parameters],
    queryFn: async () => (await getMessagesToProgram(parameters)).result,
    enabled,
  });

  useErrorAlert(query.error);

  return query;
}

function useMessagesFromProgram(parameters: MessagesFromProgramParameters, enabled: boolean) {
  const query = useInfiniteQuery({
    initialPageParam: INFINITE_QUERY.INITIAL_PAGE_PARAM,
    getNextPageParam: INFINITE_QUERY.GET_NEXT_PAGE_PARAM,
    select: INFINITE_QUERY.SELECT,

    queryKey: ['messagesFromProgram', parameters],
    queryFn: async () => (await getMessagesFromProgram(parameters)).result,
    enabled,
  });

  useErrorAlert(query.error);

  return query;
}

export { useMessagesToProgram, useMessagesFromProgram };
