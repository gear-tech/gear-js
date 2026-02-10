import { Hex } from 'viem';

import { Program } from '@/features/programs/lib/queries';
import { EXPLORER_URL } from '@/shared/config';
import { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard, isUndefined } from '@/shared/utils';

export type MessageRequest = {
  id: Hex;
  sourceAddress: Hex;
  programId: Hex;
  payload: Hex;
  value: string;
  callReply: boolean;
  txHash: Hex;
  blockNumber: string;
  createdAt: string;
  program?: Program;
};

type StateTransition = {
  id: Hex;
  hash: Hex;
  timestamp: string;
  programId: Hex;
  exited: boolean;
  valueToReceive: string | null;
  inheritor?: Hex | null;
  program?: Program;
};

export type MessageSent = {
  id: Hex;
  sourceProgramId: Hex;
  destination: Hex;
  payload: Hex;
  value: string;
  isCall: boolean;
  stateTransitionId: Hex;
  createdAt: string;
  sourceProgram?: Program;
  stateTransition?: StateTransition;
};

export type ReplyRequest = {
  id: Hex;
  sourceAddress: Hex;
  programId: Hex;
  payload: Hex;
  value: string;
  txHash: Hex;
  blockNumber: string;
  createdAt: string;
  program?: Program;
};

export type ReplySent = {
  id: Hex;
  repliedToId: Hex;
  replyCode: Hex;
  sourceProgramId: Hex;
  destination: Hex;
  payload: Hex;
  value: string;
  isCall: boolean;
  stateTransitionId: Hex;
  createdAt: string;
  sourceProgram?: Program;
  stateTransition?: StateTransition;
};

// TODO: merge with fetchWithGuard
const getIndexerUrl = (url: string, page?: number, pageSize?: number) => {
  const indexerUrl = new URL(`${EXPLORER_URL}/${url}`);

  if (!isUndefined(page) && !isUndefined(pageSize)) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    indexerUrl.searchParams.set('limit', String(limit));
    indexerUrl.searchParams.set('offset', String(offset));
  }

  return indexerUrl;
};

export const getMessageRequest = (id: Hex) =>
  fetchWithGuard<MessageRequest>({ url: getIndexerUrl(`messages/requests/${id}`) });

export const getMessageSent = (id: Hex) => fetchWithGuard<MessageSent>({ url: getIndexerUrl(`messages/sent/${id}`) });

export const getReplyRequest = (id: Hex) =>
  fetchWithGuard<ReplyRequest>({ url: getIndexerUrl(`replies/requests/${id}`) });

export const getReplySent = (id: Hex) => fetchWithGuard<ReplySent>({ url: getIndexerUrl(`replies/sent/${id}`) });

export const getMessageRequests = (page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<MessageRequest>>({
    url: getIndexerUrl('messages/requests', page, pageSize),
  });

export const getMessageSents = (page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<MessageSent>>({ url: getIndexerUrl('messages/sent', page, pageSize) });

export const getReplyRequests = (page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<ReplyRequest>>({ url: getIndexerUrl('replies/requests', page, pageSize) });

export const getReplySents = (page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<ReplySent>>({ url: getIndexerUrl('replies/sent', page, pageSize) });
