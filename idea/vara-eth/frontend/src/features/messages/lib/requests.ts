import type { Hex } from 'viem';

import type { Program } from '@/features/programs/lib/queries';
import type { PaginatedResponse } from '@/shared/types';
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
const getIndexerUrl = (explorerUrl: string, url: string, page?: number, pageSize?: number, programId?: Hex) => {
  const indexerUrl = new URL(`${explorerUrl}/${url}`);

  if (!isUndefined(page) && !isUndefined(pageSize)) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    indexerUrl.searchParams.set('limit', String(limit));
    indexerUrl.searchParams.set('offset', String(offset));
  }
  if (!isUndefined(programId)) {
    indexerUrl.searchParams.set('programId', programId);
  }

  return indexerUrl;
};

export const getMessageRequest = (explorerUrl: string, id: Hex) =>
  fetchWithGuard<MessageRequest>({ url: getIndexerUrl(explorerUrl, `messages/requests/${id}`) });

export const getMessageSent = (explorerUrl: string, id: Hex) =>
  fetchWithGuard<MessageSent>({ url: getIndexerUrl(explorerUrl, `messages/sent/${id}`) });

export const getReplyRequest = (explorerUrl: string, id: Hex) =>
  fetchWithGuard<ReplyRequest>({ url: getIndexerUrl(explorerUrl, `replies/requests/${id}`) });

export const getReplySent = (explorerUrl: string, id: Hex) =>
  fetchWithGuard<ReplySent>({ url: getIndexerUrl(explorerUrl, `replies/sent/${id}`) });

export const getMessageRequests = (explorerUrl: string, page: number, pageSize: number, programId?: Hex) =>
  fetchWithGuard<PaginatedResponse<MessageRequest>>({
    url: getIndexerUrl(explorerUrl, 'messages/requests', page, pageSize, programId),
  });

export const getMessageSents = (explorerUrl: string, page: number, pageSize: number, programId?: Hex) =>
  fetchWithGuard<PaginatedResponse<MessageSent>>({ url: getIndexerUrl(explorerUrl, 'messages/sent', page, pageSize, programId) });

export const getReplyRequests = (explorerUrl: string, page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<ReplyRequest>>({
    url: getIndexerUrl(explorerUrl, 'replies/requests', page, pageSize),
  });

export const getReplySents = (explorerUrl: string, page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<ReplySent>>({
    url: getIndexerUrl(explorerUrl, 'replies/sent', page, pageSize),
  });
