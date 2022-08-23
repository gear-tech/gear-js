import { RpcMethods } from 'shared/config';
import { PaginationModel } from 'shared/types/common';
import { MessagePaginationModel, MessageModel } from 'shared/types/message';

import { ServerRPCRequestService } from './ServerRPCRequestService';

export class MessagesRequestService {
  apiRequest = new ServerRPCRequestService();

  public fetchMessages = (params: PaginationModel) =>
    this.apiRequest.callRPC<MessagePaginationModel>(RpcMethods.GetAllMessages, { ...params });

  public fetchMessage = (id: string) => this.apiRequest.callRPC<MessageModel>(RpcMethods.GetMessage, { id });
}

export const messagesService = new MessagesRequestService();
