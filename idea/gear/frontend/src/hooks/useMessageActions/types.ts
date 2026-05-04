import type { MessageSendOptions, MessageSendReplyOptions, ProgramMetadata } from '@gear-js/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import type { ParamsToSignAndSend as CommonParamsToSignAndSend, OperationCallbacks } from '@/entities/hooks';

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

type ParamsToSignAndSend = CommonParamsToSignAndSend & {
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
  title?: string;
};

export type { ParamsToReplyMessage, ParamsToSendMessage, ParamsToSignAndSend };
