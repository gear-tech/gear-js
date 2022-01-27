import {
  AddMetaParams,
  AddMetaResult,
  AddPayloadParams,
  AllMessagesResult,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetMessagesParams,
  GetMetaParams,
  GetMetaResult,
  IMessage,
  IProgram,
} from '@gear-js/backend-interfaces';
export interface IRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?:
    | FindProgramParams
    | GetAllProgramsParams
    | AddMetaParams
    | GetMetaParams
    | AddPayloadParams
    | GetMessagesParams;
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

export interface IRpcError {
  code: RpcErrorCode;
  message: string;
}

export enum RpcErrorCode {
  GearError = -32602,
  MethodNotFoundError = -32601,
  InternalServerError = -32500,
  UnathorizedError = -32401,
}
