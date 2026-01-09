import { useQuery } from '@tanstack/react-query';

import { EXPLORER_URL } from '@/shared/config';
import { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

import { MessageRequests, MessageSent } from './requests';

export const useGetAllMessagesRequestsQuery = (page: number, pageSize: number) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allRequestMessages', limit, offset],

    queryFn: () => {
      const url = new URL(`${EXPLORER_URL}/messages/requests`);

      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      return fetchWithGuard<PaginatedResponse<MessageRequests>>({ url });
    },

    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllMessagesSentQuery = (page: number, pageSize: number) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allSentMessages', limit, offset],

    queryFn: () => {
      const url = new URL(`${EXPLORER_URL}/messages/sent`);

      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      return fetchWithGuard<PaginatedResponse<MessageSent>>({ url });
    },

    placeholderData: (previousData) => previousData,
  });
};
