import { GearTransaction } from './types';

export class GearClaimValue extends GearTransaction {
  submit(messageId: string): any {
    try {
      this.submitted = this.api.tx.gear.claimValueFromMailbox(messageId);
    } catch (error) {
      console.log(error);
    }
  }
}
