import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';

import type { HexString } from '../../common';

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
