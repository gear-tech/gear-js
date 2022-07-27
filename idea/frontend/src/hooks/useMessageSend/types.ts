import { GearMessage, Metadata, GearMessageReply } from '@gear-js/api';

import { OperationCallbacks, SignAndSendArg as CommonSignAndSendArg } from 'types/hooks';
import { Message, Reply } from 'types/program';

export type SendMessageParams = OperationCallbacks & {
  message: Message & Reply;
  metadata?: Metadata;
  extrinsic: 'handle' | 'reply';
  payloadType?: string;
};

export type SignAndSendArg = CommonSignAndSendArg & {
  apiExtrinsic: GearMessage | GearMessageReply;
  transactionName: string;
};
