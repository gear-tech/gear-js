import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { V1000MessageSendOptions, V1000MessageSendReplyOptions } from '../../types';
import { GearMessage } from '../../Message';
import { ProgramMetadata } from '../../metadata';

export declare class V1000Message extends GearMessage {
  send(
    args: V1000MessageSendOptions,
    meta: ProgramMetadata,
    typeIndex?: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;
  send(
    args: V1000MessageSendOptions,
    hexRegistry: `0x${string}`,
    typeIndex: number,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;
  send(
    args: V1000MessageSendOptions,
    metaOrHexRegistry?: ProgramMetadata | `0x${string}`,
    typeName?: string,
  ): SubmittableExtrinsic<'promise', ISubmittableResult>;

  sendReply(
    args: V1000MessageSendReplyOptions,
    meta?: ProgramMetadata,
    typeIndex?: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
  sendReply(
    args: V1000MessageSendReplyOptions,
    hexRegistry: `0x${string}`,
    typeIndex: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
  sendReply(
    args: V1000MessageSendReplyOptions,
    metaOrHexRegistry?: ProgramMetadata | `0x${string}`,
    typeName?: string,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
}
