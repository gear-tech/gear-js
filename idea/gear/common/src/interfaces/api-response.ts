import type { RpcErrorCode } from '../enums/index.js';
import type { ICode } from './code.js';
import type { IMessage } from './message.js';
import type { IPaginationResult } from './pagination.js';
import type { IProgram } from './program.js';
import type { IState } from './state.js';

interface AllMessagesResult extends IPaginationResult {
  messages: IMessage[];
  programNames?: Record<string, string>;
}

interface GetAllProgramsResult extends IPaginationResult {
  programs: IProgram[];
}

interface GetStatesResult extends IPaginationResult {
  states: IState[];
}

interface GetAllCodeResult extends IPaginationResult {
  listCode: ICode[];
}

interface AddMetaResult {
  status: 'Metadata added';
}

interface AddStateResult {
  status: 'State added';
  state: IState;
}

interface GetAllStateResult {
  states: IState[];
}

interface ProgramDataResult extends Omit<IProgram, 'meta'> {
  meta?: { meta?: string };
}

interface AddSailsResult {
  status: 'Sails idl added';
}

interface IRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?:
    | AllMessagesResult
    | GetAllProgramsResult
    | IProgram
    | IMessage
    | IProgram[]
    | IMessage[]
    | AddMetaResult
    | GetAllCodeResult
    | GetStatesResult
    | AddSailsResult;
  error?: IRpcError;
}

interface IRpcError {
  code: RpcErrorCode;
  message: string;
}

export type {
  AddMetaResult,
  AddSailsResult,
  AddStateResult,
  AllMessagesResult,
  GetAllCodeResult,
  GetAllProgramsResult,
  GetAllStateResult,
  GetStatesResult,
  IRpcError,
  IRpcResponse,
  ProgramDataResult,
};
