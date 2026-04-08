import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';

import {
  getMessageRequest,
  getMessageRequests,
  getMessageSent,
  getMessageSents,
  getReplyRequest,
  getReplyRequests,
  getReplySent,
  getReplySents,
} from './requests';

export const useGetMessageRequestByIdQuery = (id: Hex) => {
  return useQuery({
    queryKey: ['messageRequest', id],
    queryFn: () => getMessageRequest(id),
  });
};

export const useGetMessageSentByIdQuery = (id: Hex) => {
  return useQuery({
    queryKey: ['messageSent', id],
    queryFn: () => getMessageSent(id),
  });
};

export const useGetReplyRequestByIdQuery = (id: Hex) => {
  return useQuery({
    queryKey: ['replyRequest', id],
    queryFn: () => getReplyRequest(id),
  });
};

export const useGetReplySentByIdQuery = (id: Hex) => {
  return useQuery({
    queryKey: ['replySent', id],
    queryFn: () => getReplySent(id),
  });
};

export const useGetAllMessageRequestsQuery = (
  page: number,
  pageSize: number,
  programId?: Hex,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['allRequestMessages', page, pageSize, programId],
    queryFn: () => getMessageRequests(page, pageSize, programId),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useGetAllMessageSentsQuery = (
  page: number,
  pageSize: number,
  programId?: Hex,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['allSentMessages', page, pageSize, programId],
    queryFn: () => getMessageSents(page, pageSize, programId),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useGetAllReplyRequestsQuery = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['allRequestReplies', page, pageSize],
    queryFn: () => getReplyRequests(page, pageSize),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllReplySentsQuery = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['allSentReplies', page, pageSize],
    queryFn: () => getReplySents(page, pageSize),
    placeholderData: (previousData) => previousData,
  });
};
