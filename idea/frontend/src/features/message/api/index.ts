import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';

import { METHOD } from './consts';
import {
  MessageToProgram,
  MessageFromProgram,
  MessagesToProgramParameters,
  MessagesFromProgramParameters,
  PaginationResponse,
} from './types';

const getMessagesToProgram = (parameters: MessagesToProgramParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<MessageToProgram>>(METHOD.TO_PROGRAM, parameters);

const getMessagesFromProgram = (parameters: MessagesFromProgramParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<MessageFromProgram>>(METHOD.FROM_PROGRAM, parameters);

export { getMessagesToProgram, getMessagesFromProgram };
export type {
  MessageToProgram,
  MessageFromProgram,
  MessagesToProgramParameters,
  MessagesFromProgramParameters,
  PaginationResponse,
};
