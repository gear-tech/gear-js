import { HexString } from '@vara-eth/api';

import { Program } from '@/features/programs/lib/queries';
import { EXPLORER_URL } from '@/shared/config';
import { PaginatedResponse } from '@/shared/types';
import { fetchWithGuard } from '@/shared/utils';

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
  replyCode: string;
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

export const getMessageRequest = (id: HexString) =>
  fetchWithGuard<MessageRequests>({ url: `${EXPLORER_URL}/messages/requests/${id}` });

export const getMessageSent = (id: HexString) =>
  fetchWithGuard<MessageSent>({ url: `${EXPLORER_URL}/messages/sent/${id}` });

export const getReplyRequest = (id: HexString) =>
  fetchWithGuard<ReplyRequest>({ url: `${EXPLORER_URL}/replies/requests/${id}` });

export const getReplySent = (id: HexString) => fetchWithGuard<ReplySent>({ url: `${EXPLORER_URL}/replies/sent/${id}` });

// TODO: merge with fetchWithGuard
const getPaginationUrl = (url: string, page: number, pageSize: number) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const paginationUrl = new URL(`${EXPLORER_URL}/${url}`);

  paginationUrl.searchParams.set('limit', String(limit));
  paginationUrl.searchParams.set('offset', String(offset));

  return paginationUrl;
};

export const getMessageRequests = (page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<MessageRequests>>({
    url: getPaginationUrl('messages/requests', page, pageSize),
  });

export const getMessageSents = (limit: number, offset: number) =>
  fetchWithGuard<PaginatedResponse<MessageSent>>({ url: getPaginationUrl('messages/sent', limit, offset) });

export const getReplyRequests = (limit: number, offset: number) =>
  fetchWithGuard<PaginatedResponse<ReplyRequest>>({ url: getPaginationUrl('replies/requests', limit, offset) });

export const getReplySents = (limit: number, offset: number) =>
  fetchWithGuard<PaginatedResponse<ReplySent>>({ url: getPaginationUrl('replies/sent', limit, offset) });
