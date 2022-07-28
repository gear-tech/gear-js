import { META_STORAGE_ADDRESS } from 'consts';

type RequestParams = {
  method: string;
  headers: any;
  body?: string;
};

function generateRandomId() {
  return Math.floor(Math.random() * 1000000000);
}

export class ServerRPCRequestService {
  RPC_API_PATH = META_STORAGE_ADDRESS;

  async getResource(method: string, postParamArr: Array<Object>, headers = {}) {
    const url = this.RPC_API_PATH;

    const params: RequestParams = {
      method: 'POST',
      headers,
    };

    const paramArr = postParamArr.map((postParams) => {
      const requestId = generateRandomId();

      return {
        jsonrpc: '2.0',
        id: requestId,
        method,
        params: postParams,
      };
    });

    params.body = JSON.stringify(paramArr);
    params.headers['Content-Type'] = 'application/json;charset=utf-8';
    const response = await fetch(url, params);

    return response.json();
  }
}
