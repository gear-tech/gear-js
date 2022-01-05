import { PaginationModel } from 'types/common';
import { MessagePaginationModel } from 'types/message';
import { RPC_METHODS } from 'consts';
import ServerRPCRequestService from './ServerRPCRequestService';

export default class MessagesRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_MESSAGES_ALL = RPC_METHODS.GET_ALL_MESSAGES;

  public fetchMessages(params: PaginationModel) {
    return this.apiRequest.callRPC<MessagePaginationModel>(this.API_MESSAGES_ALL, { ...params });
  }
}
