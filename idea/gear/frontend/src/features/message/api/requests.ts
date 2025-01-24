import { INDEXER_RPC_SERVICE } from '@/shared/services/rpcService';
import { METHOD } from './consts';
import {
  MessagesToProgramParameters,
  PaginationResponse,
  MessageToProgram,
  MessagesFromProgramParameters,
  MessageFromProgram,
} from './types';

const getMessageToProgram = (id: string) => INDEXER_RPC_SERVICE.callRPC<MessageToProgram>(METHOD.TO_PROGRAM, { id });

const getMessageFromProgram = (id: string) =>
  INDEXER_RPC_SERVICE.callRPC<MessageFromProgram>(METHOD.FROM_PROGRAM, { id });

const getMessagesToProgram = (parameters: MessagesToProgramParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<MessageToProgram>>(METHOD.TO_PROGRAM_ALL, parameters);

const getMessagesFromProgram = (parameters: MessagesFromProgramParameters) =>
  INDEXER_RPC_SERVICE.callRPC<PaginationResponse<MessageFromProgram>>(METHOD.FROM_PROGRAM_ALL, parameters);

export { getMessageToProgram, getMessageFromProgram, getMessagesToProgram, getMessagesFromProgram };
