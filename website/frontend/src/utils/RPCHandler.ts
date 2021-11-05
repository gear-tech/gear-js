import { customAlphabet } from 'nanoid';

export interface RPCPayload {
  method: string;
  params?: object;
}

interface RPCReq extends RPCPayload {
  jsonrpc: '2.0';
  id: string;
}

export interface RPCRes extends RPCPayload {
  jsonrpc: '2.0';
  id: string;
  result?: object;
}

export type PromiseResolve = (r?: {} | PromiseLike<{}> | undefined) => void;
export type PromiseReject = (r?: any) => void;

type PendingRequest = {
  resolve: PromiseResolve;
  reject: PromiseReject;
};

export class RPCHandler {
  private nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);

  private readonly pendingRequests: {
    [id: string]: PendingRequest;
  };

  private readonly socket: any;

  private readonly message: string;

  constructor(message: string) {
    this.message = message;
    this.pendingRequests = {};
  }

  private createRequestPayload({ method, params }: RPCPayload, id?: string): RPCReq {
    return {
      jsonrpc: '2.0',
      id: id || this.nanoid(),
      method,
      params,
    };
  }

  private addReq(id: string | number) {
    return new Promise((resolve, reject) => {
      this.pendingRequests[id] = { resolve, reject };
    });
  }

  public async request(data: RPCPayload) {
    const pl = this.createRequestPayload(data);
    this.socket.emit(this.message, pl);
    return this.addReq(pl.id);
  }
}
