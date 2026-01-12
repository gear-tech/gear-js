import { useQuery } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';

import { EXPLORER_URL } from '@/shared/config';
import { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

import { Program } from '../../programs/lib/queries';

type MessageRequest = {
  id: HexString;
  sourceAddress: HexString;
  programId: HexString;
  payload: HexString;
  value: string;
  callReply: boolean;
  txHash: HexString;
  blockNumber: string;
  createdAt: string;
  program?: Program;
};

type MessageSent = {
  id: HexString;
  sourceProgramId: HexString;
  destination: HexString;
  payload: HexString;
  value: string;
  isCall: boolean;
  stateTransitionId: HexString;
  createdAt: string;
  sourceProgram?: Program;
  stateTransition?: unknown;
};

export const useGetAllMessagesRequestsQuery = (page: number, pageSize: number) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allRequestMessages', limit, offset],

    queryFn: () => {
      const url = new URL(`${EXPLORER_URL}/messages/requests`);

      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      return fetchWithGuard<PaginatedResponse<MessageRequest>>({ url });
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
