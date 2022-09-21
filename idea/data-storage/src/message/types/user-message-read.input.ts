import { MessageReadReason } from '../../common/enums';

export interface UserMessageReadInput {
  id: string;
  reason: MessageReadReason | null;
}
