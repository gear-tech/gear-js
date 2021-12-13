export interface IRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: any;
}

export interface IRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?: any;
  error?: any;
}
