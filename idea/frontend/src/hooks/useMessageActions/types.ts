import { Metadata, IMessageSendOptions, IMessageSendReplyOptions } from '@gear-js/api';

import { OperationCallbacks, ParamsToSignAndSend as CommonParamsToSignAndSend } from 'entities/hooks';

type ParamsToSendMessage = OperationCallbacks & {
  message: IMessageSendOptions;
  metadata?: Metadata;
  payloadType?: string;
};

type ParamsToReplyMessage = OperationCallbacks & {
  reply: IMessageSendReplyOptions;
  metadata?: Metadata;
  payloadType?: string;
};

type ParamsToSignAndSend = CommonParamsToSignAndSend & {
  title?: string;
};

export type { ParamsToSendMessage, ParamsToReplyMessage, ParamsToSignAndSend };
