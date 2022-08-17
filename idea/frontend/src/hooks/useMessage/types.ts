import { Metadata, IMessageSendOptions, IMessageSendReplyOptions } from '@gear-js/api';

import { OperationCallbacks, ParamsToSignAndSend as CommonParamsToSignAndSend } from 'types/hooks';

export type ParamsToSendMessage = OperationCallbacks & {
  message: IMessageSendOptions;
  metadata?: Metadata;
  payloadType?: string;
};

export type PatamsToReplyMessage = OperationCallbacks & {
  reply: IMessageSendReplyOptions;
  metadata?: Metadata;
  payloadType?: string;
};

export type ParamsToSignAndSend = CommonParamsToSignAndSend & {
  title?: string;
};
