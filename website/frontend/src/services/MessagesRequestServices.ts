import { PaginationModel } from 'types/common';
import { MessagePaginationModel, MessageModel } from 'types/message';
import { RPC_METHODS } from 'consts';
import ServerRPCRequestService from './ServerRPCRequestService';

class MessagesRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_MESSAGES_ALL = RPC_METHODS.GET_ALL_MESSAGES;

  protected readonly API_MESSAGE = RPC_METHODS.GET_MESSAGE;

  public fetchMessages = (params: PaginationModel) => {
    return this.apiRequest.callRPC<MessagePaginationModel>(this.API_MESSAGES_ALL, { ...params });
  };

  public fetchMessage = (id: string) => {
    return this.apiRequest.callRPC<MessageModel>(this.API_MESSAGE, { id });
  };
}

export const messagesService = new MessagesRequestService();
