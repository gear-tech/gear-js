import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';

import { METHOD } from './consts';
import {
  MessageToProgram,
  MessageFromProgram,
  MessagesToProgramParameters,
  MessagesToProgramResponse,
  MessagesFromProgramParameters,
  MessagesFromProgramResponse,
  PaginationResponse,
} from './types';

const getMessagesToProgram = (parameters: MessagesToProgramParameters) =>
  INDEXER_RPC_SERVICE.callRPC<MessagesToProgramResponse>(METHOD.TO_PROGRAM, parameters);

const getMessagesFromProgram = (parameters: MessagesFromProgramParameters) =>
  INDEXER_RPC_SERVICE.callRPC<MessagesFromProgramResponse>(METHOD.FROM_PROGRAM, parameters);

export { getMessagesToProgram, getMessagesFromProgram };
export type {
  MessageToProgram,
  MessageFromProgram,
  MessagesToProgramParameters,
  MessagesFromProgramParameters,
  PaginationResponse,
};
