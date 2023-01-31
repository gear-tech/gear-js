import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { GasLimit, Value } from '../../common';

export interface IProgramUploadOptions {
  code: Buffer | Uint8Array;
  salt?: `0x${string}`;
  initPayload?: AnyJson;
  gasLimit: GasLimit;
  value?: Value;
}

export interface IProgramCreateOptions extends Omit<IProgramUploadOptions, 'code'> {
  codeId: HexString | Uint8Array;
}

export interface IProgramUploadResult {
  programId: HexString;
  codeId: HexString;
  salt: HexString;
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
}

export type IProgramCreateResult = Omit<IProgramUploadResult, 'codeId'>;
