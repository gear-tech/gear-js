import { MessageStatus } from '../../common/enums';
import { BaseDataInput } from '../../gear/types';

export interface MessageDispatchedDataInput extends BaseDataInput {
  statuses: { [key: string]: MessageStatus };
}
