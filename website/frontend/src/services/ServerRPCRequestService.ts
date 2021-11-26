import { API_PATH } from 'consts';

export default class ServerRPCRequestService {
  protected readonly RPC_API_PATH = API_PATH;

  private generateRandomId() {
    return Math.floor(Math.random() * 1000000000);
  }

  public async getResource(method: string = '', postParams: Object | null = {}, headers: Object = {}) {
    const url = this.RPC_API_PATH;
    const requestId = this.generateRandomId();

    const params: any = {
      method: 'POST',
      headers,
    };

    const methodParams = { ...postParams, chain: localStorage.getItem('chain') };

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
