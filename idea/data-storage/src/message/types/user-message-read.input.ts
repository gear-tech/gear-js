import { MessageReadReason } from '../../common/enums';
import { BaseDataInput } from '../../gear/types';

export interface UserMessageReadInput extends BaseDataInput {
  id: string;
  reason: MessageReadReason | null;
}
