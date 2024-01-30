import { ProgramMetadata, MessageSendOptions, MessageSendReplyOptions } from '@gear-js/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { OperationCallbacks, ParamsToSignAndSend as CommonParamsToSignAndSend } from '@/entities/hooks';

type ParamsToSendMessage = OperationCallbacks & {
  message: MessageSendOptions;
  voucherId: string;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToReplyMessage = OperationCallbacks & {
  reply: MessageSendReplyOptions;
  voucherId: string;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToSendMessageDeprecated = Omit<ParamsToSendMessage, 'voucherId'> & { withVoucher: boolean };
type ParamsToReplyMessageDeprecated = Omit<ParamsToReplyMessage, 'voucherId'> & { withVoucher: boolean };

type ParamsToSignAndSend = CommonParamsToSignAndSend & {
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
  title?: string;
};

export type {
  ParamsToSendMessage,
  ParamsToReplyMessage,
  ParamsToSignAndSend,
  ParamsToSendMessageDeprecated,
  ParamsToReplyMessageDeprecated,
};
