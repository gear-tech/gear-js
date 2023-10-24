import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { VaraMessageSendOptions, VaraMessageSendReplyOptions } from '../../types';
import { GearMessage } from '../../Message';
import { ProgramMetadata } from '../../metadata';

export declare class VaraMessage extends GearMessage {
  send(
    args: VaraMessageSendOptions,
    meta: ProgramMetadata,
    typeIndex?: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;
  send(
    args: VaraMessageSendOptions,
    hexRegistry: `0x${string}`,
    typeIndex: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;
  send(
    args: VaraMessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | `0x${string}`,
    typeName?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  sendReply(
    args: VaraMessageSendReplyOptions,
    meta?: ProgramMetadata,
    typeIndex?: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
  sendReply(
    args: VaraMessageSendReplyOptions,
    hexRegistry: `0x${string}`,
    typeIndex: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
  sendReply(
    args: VaraMessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | `0x${string}`,
    typeName?: string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
}
