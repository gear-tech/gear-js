import { Metadata } from '@gear-js/api';

import { OperationCallbacks, SignAndSendArg as CommonSignAndSendArg } from 'types/hooks';
import { Message, Reply } from 'types/program';

export type SendMessageParams = OperationCallbacks & {
  message: Message;
  metadata?: Metadata;
  payloadType?: string;
};

export type ReplyMessageParams = OperationCallbacks & {
  reply: Reply;
  metadata?: Metadata;
  payloadType?: string;
};

export type SignAndSendArg = CommonSignAndSendArg & {
  isReply?: boolean;
};
