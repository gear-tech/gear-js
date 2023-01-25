import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { ClaimValueError } from './errors';
import { GearTransaction } from './Transaction';
import { Hex } from './types';

/**
 * Claim value from mailbox
 */
export class GearClaimValue extends GearTransaction {
  /**
   * Submit `claimValueFromMailbox` extrinsic
   * @param messageId MessageId with value to be claimed
   */
  submit(messageId: Hex): SubmittableExtrinsic<'promise', ISubmittableResult> {
    try {
      this.extrinsic = this._api.tx.gear.claimValue(messageId);
      return this.extrinsic;
    } catch (error) {
      throw new ClaimValueError();
    }
  }
}
