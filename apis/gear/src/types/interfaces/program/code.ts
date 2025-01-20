import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { HexString } from '../../index';

export interface CodeUploadResult {
  /**
   * Code hash
   */
  codeHash: HexString;
  /**
   * Submittable extrinsic
   */
  extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
  /**
   * @deprecated will be removed in next major version
   */
  submitted: SubmittableExtrinsic<'promise', ISubmittableResult>;
}
