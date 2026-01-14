import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

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

export const useGetMessageRequestByIdQuery = (id: HexString) => {
  return useQuery({
    queryKey: ['messageRequest', id],
    queryFn: () => getMessageRequest(id),
  });
};

export const useGetMessageSentByIdQuery = (id: HexString) => {
  return useQuery({
    queryKey: ['messageSent', id],
    queryFn: () => getMessageSent(id),
  });
};

export const useGetReplyRequestByIdQuery = (id: HexString) => {
  return useQuery({
    queryKey: ['replyRequest', id],
    queryFn: () => getReplyRequest(id),
  });
};

export const useGetReplySentByIdQuery = (id: HexString) => {
  return useQuery({
    queryKey: ['replySent', id],
    queryFn: () => getReplySent(id),
  });
};

export const useGetAllMessageRequestsQuery = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['allRequestMessages', page, pageSize],
    queryFn: () => getMessageRequests(page, pageSize),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllMessageSentsQuery = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['allSentMessages', page, pageSize],
    queryFn: () => getMessageSents(page, pageSize),
    placeholderData: (previousData) => previousData,
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
