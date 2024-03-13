import { RpcMethods } from '@/shared/config';
import { rpcService } from '@/shared/services/rpcService';
import { IMessage } from '@/entities/message';

import { PaginationModel } from '../types';
import { MessagePaginationModel } from './types';

const fetchMessages = (params: PaginationModel & { withPrograms?: boolean }) =>
  rpcService.callRPC<MessagePaginationModel>(RpcMethods.GetAllMessages, { ...params });

const fetchMessage = (params: { id: string; withMetahash: boolean }) =>
  rpcService.callRPC<IMessage>(RpcMethods.GetMessage, params);

export { fetchMessage, fetchMessages };
