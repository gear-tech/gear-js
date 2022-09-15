import { MessageStatus } from '../../common/enums';

export interface MessageDispatchedDataInput {
  statuses: { [key: string]: MessageStatus };
  blockHash?: string;
  timestamp?: number;
  genesis?: string;
}
