import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { ClaimValueError } from './errors/claim.errors';
import { GearTransaction } from './types';

export class GearClaimValue extends GearTransaction {
  submit(messageId: string): SubmittableExtrinsic<'promise', ISubmittableResult> {
    try {
      this.submitted = this.api.tx.gear.claimValueFromMailbox(messageId);
      return this.submitted;
    } catch (error) {
      throw new ClaimValueError();
    }
  }
}
