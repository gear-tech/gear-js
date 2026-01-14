import { HexString } from '@vara-eth/api';

import { Program } from '@/features/programs/lib/queries';
import { EXPLORER_URL } from '@/shared/config';
import { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard, isUndefined } from '@/shared/utils';

type MessageRequests = {
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

type StateTransition = {
  id: HexString;
  hash: HexString;
  timestamp: string;
  programId: HexString;
  exited: boolean;
  valueToReceive: string | null;
  inheritor?: HexString | null;
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
  stateTransition?: StateTransition;
};

type ReplyRequest = {
  id: HexString;
  sourceAddress: HexString;
  programId: HexString;
  payload: HexString;
  value: string;
  txHash: HexString;
  blockNumber: string;
  createdAt: string;
  program?: Program;
};

type ReplySent = {
  id: HexString;
  repliedToId: HexString;
  replyCode: HexString;
  sourceProgramId: HexString;
  destination: HexString;
  payload: HexString;
  value: string;
  isCall: boolean;
  stateTransitionId: HexString;
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

export const getMessageRequest = (id: HexString) =>
  fetchWithGuard<MessageRequests>({ url: getIndexerUrl(`messages/requests/${id}`) });

export const getMessageSent = (id: HexString) =>
  fetchWithGuard<MessageSent>({ url: getIndexerUrl(`messages/sent/${id}`) });

export const getReplyRequest = (id: HexString) =>
  fetchWithGuard<ReplyRequest>({ url: getIndexerUrl(`replies/requests/${id}`) });

export const getReplySent = (id: HexString) => fetchWithGuard<ReplySent>({ url: getIndexerUrl(`replies/sent/${id}`) });

export const getMessageRequests = (page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<MessageRequests>>({
    url: getIndexerUrl('messages/requests', page, pageSize),
  });

export const getMessageSents = (limit: number, offset: number) =>
  fetchWithGuard<PaginatedResponse<MessageSent>>({ url: getIndexerUrl('messages/sent', limit, offset) });

export const getReplyRequests = (limit: number, offset: number) =>
  fetchWithGuard<PaginatedResponse<ReplyRequest>>({ url: getIndexerUrl('replies/requests', limit, offset) });

export const getReplySents = (limit: number, offset: number) =>
  fetchWithGuard<PaginatedResponse<ReplySent>>({ url: getIndexerUrl('replies/sent', limit, offset) });
