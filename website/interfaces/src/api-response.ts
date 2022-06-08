import { IMessage } from './message';
import { IPaginationResult } from './pagination';
import { IProgram } from './program';
import { IRpcError } from '@gear-js/api-gateway/src/json-rpc/interface';

export interface AllMessagesResult extends IPaginationResult {
  messages: IMessage[];
}

export interface GetAllProgramsResult extends IPaginationResult {
  programs: IProgram[];
}

export interface AddMetaResult {
  status: 'Metadata added';
}

export interface GetMetaResult {
  program: string;
  meta: string;
  metaFile: string;
}

export interface ProgramDataResult extends Omit<IProgram, 'meta'> {
  meta?: { meta?: string };
}
export interface IRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?:
    | AllMessagesResult
    | GetAllProgramsResult
    | IProgram
    | IMessage
    | IProgram[]
    | IMessage[]
    | GetMetaResult
    | AddMetaResult;
  error?: IRpcError;
}
