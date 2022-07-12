import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Bytes } from '@polkadot/types';

import { GearTransaction } from './Transaction';
import { generateCodeHash } from './utils';
import { Hex } from './types';
export class GearCode extends GearTransaction {
  /**
   * Submit code without initialization
   * @param code
   * @returns Code hash
   */
  submit(code: Buffer | Uint8Array): { codeHash: Hex; submitted: SubmittableExtrinsic<'promise', ISubmittableResult> } {
    const codeBytes = this.createType.create('bytes', Array.from(code)) as Bytes;
    this.submitted = this.api.tx.gear.submitCode(codeBytes);
    const codeHash = generateCodeHash(code);
    return { codeHash, submitted: this.submitted };
  }
}
