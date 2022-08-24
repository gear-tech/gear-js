import { RpcMethods } from 'shared/config';
import { RPCService } from 'shared/services/rpcService';
import { MessageModel } from 'entities/message';

import { PaginationModel } from '../types';
import { MessagePaginationModel } from './types';

class MessagesRequestService {
  apiRequest = new RPCService();

  public fetchMessages = (params: PaginationModel) =>
    this.apiRequest.callRPC<MessagePaginationModel>(RpcMethods.GetAllMessages, { ...params });

  public fetchMessage = (id: string) => this.apiRequest.callRPC<MessageModel>(RpcMethods.GetMessage, { id });
}

export { MessagesRequestService };
