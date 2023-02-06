enum RPCErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  MetadataNotFound = 32404,
  InvalidParams = -32602,
  InternalError = -32603,
}

const RPC_VERSION = '2.0';

export { RPCErrorCode, RPC_VERSION };
