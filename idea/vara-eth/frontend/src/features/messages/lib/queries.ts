import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import type { Hex } from 'viem';

import { nodeAtom } from '@/app/store/node';

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
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['messageRequest', id, explorerUrl],
    queryFn: () => getMessageRequest(explorerUrl, id),
  });
};

export const useGetMessageSentByIdQuery = (id: Hex) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['messageSent', id, explorerUrl],
    queryFn: () => getMessageSent(explorerUrl, id),
  });
};

export const useGetReplyRequestByIdQuery = (id: Hex) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['replyRequest', id, explorerUrl],
    queryFn: () => getReplyRequest(explorerUrl, id),
  });
};

export const useGetReplySentByIdQuery = (id: Hex) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['replySent', id, explorerUrl],
    queryFn: () => getReplySent(explorerUrl, id),
  });
};

export const useGetAllMessageRequestsQuery = (page: number, pageSize: number) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['allRequestMessages', page, pageSize, explorerUrl],
    queryFn: () => getMessageRequests(explorerUrl, page, pageSize),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllMessageSentsQuery = (page: number, pageSize: number) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['allSentMessages', page, pageSize, explorerUrl],
    queryFn: () => getMessageSents(explorerUrl, page, pageSize),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllReplyRequestsQuery = (page: number, pageSize: number) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['allRequestReplies', page, pageSize, explorerUrl],
    queryFn: () => getReplyRequests(explorerUrl, page, pageSize),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAllReplySentsQuery = (page: number, pageSize: number) => {
  const { explorerUrl } = useAtomValue(nodeAtom);

  return useQuery({
    queryKey: ['allSentReplies', page, pageSize, explorerUrl],
    queryFn: () => getReplySents(explorerUrl, page, pageSize),
    placeholderData: (previousData) => previousData,
  });
};
