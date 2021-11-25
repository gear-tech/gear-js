import io from 'socket.io-client';
import { customAlphabet } from 'nanoid';
import { GEAR_LOCAL_WS_URI } from '../consts';

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

  private readonly subscriptions: {
    [id: string]: string;
  };

  private readonly socket: any;

  private readonly message: string;

  constructor(message: string) {
    this.message = message;
    this.pendingRequests = {};
    this.subscriptions = {};
    this.socket = io(GEAR_LOCAL_WS_URI, {
      transports: ['websocket'],
      query: {},
    });
    this.socket.on('message', (data: RPCReq) => {
      this.settleRequest(data);
    });
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

  private settleRequest(data: RPCReq) {
    for (const pendingRequestsKey in this.pendingRequests) {
      if (data.id in this.pendingRequests) {
        const current = this.pendingRequests[data.id];
        delete this.pendingRequests[pendingRequestsKey];
        if (current === undefined) {
          return;
        }
        current.resolve(data);
      }
    }
  }

  public async request(data: RPCPayload) {
    const pl = this.createRequestPayload(data);
    this.socket.emit(this.message, pl);
    return this.addReq(pl.id);
  }

  public subscribe(data: RPCPayload, callback: (res: unknown) => void) {
    const pl = this.createRequestPayload(data);
    this.socket.emit(this.message, pl);
    this.subscriptions[pl.id] = pl.id;
    this.socket.on(this.message, (res: RPCRes) => {
      if (res.id in this.subscriptions) {
        callback(res.result);
      }
    });
    return pl.id;
  }

  public unsubscribe(id: string, method: string) {
    if (id in this.subscriptions) {
      const payload = this.createRequestPayload(
        {
          method,
        },
        id
      );
      this.socket.emit(this.message, payload);
      delete this.subscriptions[id];
      return true;
    }
    return false;
  }
}
