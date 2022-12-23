import { IMessage } from './message';
import { IPaginationResult } from './pagination';
import { IProgram } from './program';
import { ICode } from './code';
import { RpcErrorCode } from '../enums';
import { IMetaData } from './meta';
import { IState } from './state';

interface AllMessagesResult extends IPaginationResult {
  messages: IMessage[];
}

interface GetAllProgramsResult extends IPaginationResult {
  programs: IProgram[];
}

interface GetAllCodeResult extends IPaginationResult {
  listCode: ICode[];
}

interface AddMetaResult {
  status: 'Metadata added';
}

interface AddStateResult {
  status: 'State added';
}

interface GetMetaResult {
  program: string;
  hex: string;
  data: string;
}

interface GetAllStateResult {
  states: IState[];
}

interface ProgramDataResult extends Omit<IProgram, 'meta'> {
  meta?: { meta?: string };
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
    | GetMetaResult
    | AddMetaResult
    | GetAllCodeResult;
  error?: IRpcError;
}

interface IRpcError {
  code: RpcErrorCode;
  message: string;
}

export {
  AllMessagesResult,
  GetAllProgramsResult,
  GetAllCodeResult,
  AddMetaResult,
  AddStateResult,
  GetAllStateResult,
  GetMetaResult,
  ProgramDataResult,
  IRpcResponse,
  IRpcError,
};
