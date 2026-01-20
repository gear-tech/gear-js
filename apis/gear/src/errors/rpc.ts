export class RpcMethodNotSupportedError extends Error {
  constructor(methodName: string) {
    super(`RPC method '${methodName}' is not supported`);
  }
}
