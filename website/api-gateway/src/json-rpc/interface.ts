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
