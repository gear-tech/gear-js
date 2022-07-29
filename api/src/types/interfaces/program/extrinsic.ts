import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { AnyJson } from '@polkadot/types/types';

import { GasLimit, Hex, Value } from '../../common';

export interface IProgramUploadOptions {
  code: Buffer | Uint8Array;
  salt?: `0x${string}`;
  initPayload?: AnyJson;
  gasLimit: GasLimit;
  value?: Value;
}

export interface IProgramCreateOptions extends Omit<IProgramUploadOptions, 'code'> {
  codeId: Hex | Uint8Array;
}

export interface IProgramUploadResult {
  programId: Hex;
  codeId: Hex;
  salt: Hex;
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
}

export type IProgramCreateResult = Omit<IProgramUploadResult, 'codeId'>;
