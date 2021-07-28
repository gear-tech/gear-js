export default class ServerRPCRequestService {

    protected readonly API_PATH = 'https://idea.gear-tech.io/api';
    
    protected readonly DEV_API_PATH = 'http://localhost:3000/api';

    private generateRandomId() {
        return Math.floor(Math.random() * 1000000000);
    }

    public async getResource(method: string = "", postParams: Object | null = {}, headers: Object = {}) {

        const url = this.API_PATH;
        const requestId = this.generateRandomId();

        const params: any = {
            method: "POST",
            headers 
        };
  
        params.body = JSON.stringify({
            jsonrpc: "2.0",
            id: requestId,
            method,
            params: postParams
        });
        params.headers['Content-Type'] = 'application/json;charset=utf-8';
    
      const response = await fetch(url, params);
  
      return response.json();
    }
  }
  