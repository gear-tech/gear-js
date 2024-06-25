import { RpcMethods } from '@/shared/config';
import { rpcService } from '@/shared/services/rpcService';
import { Message } from '@/features/message';

import { PaginationModel } from '../types';
import { MessagePaginationModel } from './types';

const fetchMessages = (params: PaginationModel & { withPrograms?: boolean }) =>
  rpcService.callRPC<MessagePaginationModel>(RpcMethods.GetAllMessages, { ...params });

const fetchMessage = (params: { id: string; withMetahash: boolean }) =>
  rpcService.callRPC<Message>(RpcMethods.GetMessage, params);

export { fetchMessage, fetchMessages };
