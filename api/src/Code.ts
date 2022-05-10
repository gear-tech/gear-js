import { GearTransaction } from './Transaction';
import { Hex } from './types';
import { Bytes } from '@polkadot/types';
import { generateCodeHash } from './utils';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
export class GearCode extends GearTransaction {
  /**
   * Submit code without initialization
   * @param code
   * @returns Code hash
   */
  submit(code: Buffer): { codeHash: Hex; submitted: SubmittableExtrinsic<'promise', ISubmittableResult> } {
    const codeBytes = this.createType.create('bytes', Array.from(code)) as Bytes;
    this.submitted = this.api.tx.gear.submitCode(codeBytes);
    const codeHash = generateCodeHash(code);
    return { codeHash, submitted: this.submitted };
  }
}
