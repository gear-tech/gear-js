import { IMessage } from './message';
import { IPaginationResult } from './pagination';
import { IProgram } from './program';
import { ICode } from './code';

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

interface GetMetaResult {
  program: string;
  meta: string;
  metaFile: string;
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

enum RpcErrorCode {
  GearError = -32602,
  MethodNotFoundError = -32601,
  InternalServerError = -32500,
  UnathorizedError = -32401,
}

export {
  AllMessagesResult,
  GetAllProgramsResult,
  GetAllCodeResult,
  AddMetaResult,
  GetMetaResult,
  ProgramDataResult,
  IRpcResponse,
  IRpcError,
  RpcErrorCode,
};
