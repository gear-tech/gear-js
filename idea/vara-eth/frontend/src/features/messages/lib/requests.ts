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

export type InjectedTransaction = {
  id: Hex;
  destination: Hex;
  senderAddress: Hex;
  referenceBlock: Hex;
  salt: Hex;
  signature: Hex;
  value: string;
  payload: Hex;
  createdAt: string;
};

type ListQueryParams = {
  programId?: Hex;
  destination?: Hex;
  repliedToId?: Hex;
};

// TODO: merge with fetchWithGuard
const getIndexerUrl = (
  explorerUrl: string,
  path: string,
  pagination?: { page: number; pageSize: number },
  query?: ListQueryParams,
) => {
  const indexerUrl = new URL(`${explorerUrl}/${path}`);

  if (pagination) {
    const { page, pageSize } = pagination;
    indexerUrl.searchParams.set('limit', String(pageSize));
    indexerUrl.searchParams.set('offset', String((page - 1) * pageSize));
  }

  if (!isUndefined(query?.programId)) {
    indexerUrl.searchParams.set('programId', query.programId);
  }
  if (!isUndefined(query?.destination)) {
    indexerUrl.searchParams.set('destination', query.destination);
  }
  if (!isUndefined(query?.repliedToId)) {
    indexerUrl.searchParams.set('repliedToId', query.repliedToId);
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
    url: getIndexerUrl(explorerUrl, 'messages/requests', { page, pageSize }, { programId }),
  });

export const getMessageSents = (explorerUrl: string, page: number, pageSize: number, programId?: Hex) =>
  fetchWithGuard<PaginatedResponse<MessageSent>>({
    url: getIndexerUrl(explorerUrl, 'messages/sent', { page, pageSize }, { programId }),
  });

export const getReplyRequests = (explorerUrl: string, page: number, pageSize: number) =>
  fetchWithGuard<PaginatedResponse<ReplyRequest>>({
    url: getIndexerUrl(explorerUrl, 'replies/requests', { page, pageSize }),
  });

export const getReplySents = (
  explorerUrl: string,
  page: number,
  pageSize: number,
  query?: Pick<ListQueryParams, 'programId' | 'repliedToId'>,
) =>
  fetchWithGuard<PaginatedResponse<ReplySent>>({
    url: getIndexerUrl(explorerUrl, 'replies/sent', { page, pageSize }, query),
  });

export const getInjectedTransaction = (explorerUrl: string, id: Hex) =>
  fetchWithGuard<InjectedTransaction>({ url: getIndexerUrl(explorerUrl, `injected-transactions/${id}`) });

export const getInjectedTransactions = (
  explorerUrl: string,
  page: number,
  pageSize: number,
  query?: Pick<ListQueryParams, 'destination'>,
) =>
  fetchWithGuard<PaginatedResponse<InjectedTransaction>>({
    url: getIndexerUrl(explorerUrl, 'injected-transactions', { page, pageSize }, query),
  });
