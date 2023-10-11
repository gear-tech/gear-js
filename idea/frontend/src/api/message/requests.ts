import { RpcMethods } from '@/shared/config';
import { rpcService } from '@/shared/services/rpcService';
import { IMessage } from '@/entities/message';

import { PaginationModel } from '../types';
import { MessagePaginationModel } from './types';

const fetchMessages = (params: PaginationModel) =>
  rpcService.callRPC<MessagePaginationModel>(RpcMethods.GetAllMessages, { ...params });

const fetchMessage = (id: string) => rpcService.callRPC<IMessage>(RpcMethods.GetMessage, { id });

export { fetchMessage, fetchMessages };
