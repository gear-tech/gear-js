import { ProgramMetadata, MessageSendOptions, MessageSendReplyOptions, HexString } from '@gear-js/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { OperationCallbacks, ParamsToSignAndSend as CommonParamsToSignAndSend } from '@/entities/hooks';

type ParamsToSendMessage = OperationCallbacks & {
  message: MessageSendOptions;
  voucherId: HexString | false;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToReplyMessage = OperationCallbacks & {
  reply: MessageSendReplyOptions;
  voucherId: HexString | false;
  metadata?: ProgramMetadata;
  payloadType?: string;
};

type ParamsToSignAndSend = CommonParamsToSignAndSend & {
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
  title?: string;
};

export type { ParamsToSendMessage, ParamsToReplyMessage, ParamsToSignAndSend };
