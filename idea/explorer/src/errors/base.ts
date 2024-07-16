import { JsonRpcError } from '../types';

export class GenesisNotFound implements JsonRpcError {
  code = -32601;
  message = 'Genesis not found in the request';
}

export class NetworkNotSupported implements JsonRpcError {
  code = -32602;
  message = 'Network is not supported';
  data = undefined;

  constructor(public genesis: string) {
    this.data = 'genesis: ' + genesis;
  }
}
