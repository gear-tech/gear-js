import { Metadata, IMessageSendOptions, IMessageSendReplyOptions } from '@gear-js/api';

import { OperationCallbacks, SignAndSendArg as CommonSignAndSendArg } from 'types/hooks';

export type SendMessageParams = OperationCallbacks & {
  message: IMessageSendOptions;
  metadata?: Metadata;
  payloadType?: string;
};

export type ReplyMessageParams = OperationCallbacks & {
  reply: IMessageSendReplyOptions;
  metadata?: Metadata;
  payloadType?: string;
};

export type SignAndSendArg = CommonSignAndSendArg & {
  isReply?: boolean;
};
