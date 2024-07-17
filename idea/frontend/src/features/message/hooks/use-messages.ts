import { useInfiniteQuery } from '@tanstack/react-query';

import {
  getMessagesFromProgram,
  getMessagesToProgram,
  MessagesToProgramParameters,
  MessagesFromProgramParameters,
  PaginationResponse,
} from '../api';
import { useErrorAlert } from './use-error-alert';
import { DEFAULT_LIMIT } from '@/shared/config';

const getNextPageParam = <T>({ result, count }: PaginationResponse<T>, allPages: PaginationResponse<T>[]) => {
  const lastPageCount = result.length;
  const fetchedCount = (allPages.length - 1) * DEFAULT_LIMIT + lastPageCount;

  return fetchedCount < count ? fetchedCount : undefined;
};

const select = <T>({ pages }: { pages: PaginationResponse<T>[] }) => ({
  result: pages.flatMap((page) => page.result),
  count: pages[0].count,
});

const DEFAULT_INFINITE_QUERY_OPTIONS = {
  initialPageParam: 0,
  getNextPageParam,
  select,
} as const;

function useMessagesToProgram(parameters: MessagesToProgramParameters, enabled: boolean) {
  const query = useInfiniteQuery({
    ...DEFAULT_INFINITE_QUERY_OPTIONS,
    select, // problem with return type if desctructured from options

    queryKey: ['messagesToProgram', parameters],
    queryFn: async () => (await getMessagesToProgram(parameters)).result,
    enabled,
  });

  useErrorAlert(query.error);

  return query;
}

function useMessagesFromProgram(parameters: MessagesFromProgramParameters, enabled: boolean) {
  const query = useInfiniteQuery({
    ...DEFAULT_INFINITE_QUERY_OPTIONS,
    select, // problem with return type if desctructured from options

    queryKey: ['messagesFromProgram', parameters],
    queryFn: async () => (await getMessagesFromProgram(parameters)).result,
    enabled,
  });

  useErrorAlert(query.error);

  return query;
}

export { useMessagesToProgram, useMessagesFromProgram };
