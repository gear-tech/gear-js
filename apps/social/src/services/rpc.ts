import { IDE_BACKEND_ADDRESS } from 'consts';

type RequestParams = {
  method: string;
  headers: any;
  body?: string;
};

function generateRandomId() {
  return Math.floor(Math.random() * 1000000000);
}

export class ServerRPCRequestService {
  RPC_API_PATH = IDE_BACKEND_ADDRESS;

  async getResource(method: string, postParams: Object = {}, headers = {}) {
    const url = this.RPC_API_PATH;
    const requestId = generateRandomId();

    const params: RequestParams = {
      method: 'POST',
      headers,
    };

    const methodParams = { ...postParams };

    params.body = JSON.stringify({
      jsonrpc: '2.0',
      id: requestId,
      method,
      params: methodParams,
    });

    params.headers['Content-Type'] = 'application/json;charset=utf-8';

    const response = await fetch(url, params);

    return response.json();
  }
}
