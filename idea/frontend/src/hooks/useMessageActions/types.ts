import { ProgramMetadata, IMessageSendOptions, IMessageSendReplyOptions } from '@gear-js/api';

import { OperationCallbacks, ParamsToSignAndSend as CommonParamsToSignAndSend } from '@/entities/hooks';

type ParamsToSendMessage = OperationCallbacks & {
  message: IMessageSendOptions;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToReplyMessage = OperationCallbacks & {
  reply: IMessageSendReplyOptions;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToSignAndSend = CommonParamsToSignAndSend & {
  title?: string;
};

export type { ParamsToSendMessage, ParamsToReplyMessage, ParamsToSignAndSend };
