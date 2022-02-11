import { GearTransaction } from './types';
import { Hex } from './interfaces';
import { Bytes, u64 } from '@polkadot/types';

export class GearCode extends GearTransaction {
  /**
   * Submit code without initialization
   * @param code
   * @returns Code hash
   */
  submit(code: Buffer): Hex {
    const codeBytes = this.createType.create('bytes', Array.from(code)) as Bytes;
    this.submitted = this.api.tx.gear.submitCode(codeBytes);
    const codeHash = undefined;
    return codeHash;
  }
}
