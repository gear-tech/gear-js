import {
  ProgramMetadata,
  IMessageSendOptions,
  IMessageSendReplyOptions,
  VaraMessageSendOptions,
  VaraMessageSendReplyOptions,
} from '@gear-js/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { OperationCallbacks, ParamsToSignAndSend as CommonParamsToSignAndSend } from '@/entities/hooks';

type ParamsToSendMessage = OperationCallbacks & {
  message: IMessageSendOptions | VaraMessageSendOptions;
  withVoucher: boolean;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToReplyMessage = OperationCallbacks & {
  reply: IMessageSendReplyOptions | VaraMessageSendReplyOptions;
  withVoucher: boolean;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToSignAndSend = CommonParamsToSignAndSend & {
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
  title?: string;
};

export type { ParamsToSendMessage, ParamsToReplyMessage, ParamsToSignAndSend };
