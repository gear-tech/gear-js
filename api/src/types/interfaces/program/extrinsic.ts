import { BTreeSet, u32 } from '@polkadot/types';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { GasLimit, Value } from '../../common';
import { PayloadType } from 'types/payload';

export interface V1010ProgramUploadOptions {
  code: HexString | Uint8Array;
  salt?: `0x${string}`;
  initPayload?: PayloadType;
  gasLimit: GasLimit;
  value?: Value;
  keepAlive?: boolean;
}

export type ProgramUploadOptions = V1010ProgramUploadOptions;

export interface V1010ProgramCreateOptions extends Omit<V1010ProgramUploadOptions, 'code'> {
  codeId: HexString | Uint8Array;
}

export type ProgramCreateOptions = V1010ProgramCreateOptions;

export interface IProgramUploadResult {
  programId: HexString;
  codeId: HexString;
  salt: HexString;
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
}

export type IProgramCreateResult = Omit<IProgramUploadResult, 'codeId'>;

export interface IResumeSessionInitArgs {
  /**
   * Program ID to resume
   */
  programId: HexString;
  /**
   * Allocations obtained with `api.programStorage.getProgramPages` method
   */
  allocations: Array<number | string | bigint> | BTreeSet<u32> | HexString;
  /**
   * Hash of the code of the program
   */
  codeHash: HexString;
}

export type GearPageNumberHuman = string | number | bigint;

export interface IResumeSessionPushArgs {
  /**
   * Session ID recieved during `resumeSessionInit` transaction
   */
  sessionId: string | number | bigint;
  /**
   * Program pages with data
   */
  memoryPages: Array<[GearPageNumberHuman, HexString | Uint8Array]>;
}

export interface IResumeSessionCommitArgs {
  /**
   * Session ID recieved during `resumeSessionInit` transaction
   */
  sessionId: string | number | bigint;
  /**
   * Count of blocks till program will be paused
   */
  blockCount: string | number | bigint;
}
