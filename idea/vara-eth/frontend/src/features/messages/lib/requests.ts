import { HexString } from '@vara-eth/api';

import { Program } from '@/features/programs/lib/queries';
import { EXPLORER_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/utils';

export type MessageRequests = {
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

export type MessageSent = {
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

export const getMessageRequests = (id: HexString) =>
  fetchWithGuard<MessageRequests>({ url: `${EXPLORER_URL}/messages/requests/${id}` });

export const getMessageSent = (id: HexString) =>
  fetchWithGuard<MessageSent>({ url: `${EXPLORER_URL}/messages/sent/${id}` });
