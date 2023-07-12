import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { generateVoucherId, validateVoucher } from './utils';
import { GearTransaction } from './Transaction';

export class GearVoucher extends GearTransaction {
  /**
   * ### Issue a new voucher for a `user` to be used to pay for sending messages to `program_id` program.
   * @param to The voucher holder account id.
   * @param program The program id, messages to whom can be paid with the voucher.
   * @param value The voucher amount.
   * @returns Submittable result
   *
   * @example
   * ```javascript
   * const programId = '0x..';
   * const account = '0x...'
   * const tx = api.voucher.issue(account, programId, 10000)
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  issue(
    to: HexString,
    program: HexString,
    value: number | bigint | string,
  ): { extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>; voucherId: HexString } {
    const voucherId = generateVoucherId(to, program);
    this.extrinsic = this._api.tx.gearVoucher.issue(to, program, value);
    return { extrinsic: this.extrinsic, voucherId };
  }

  async exists(programId: HexString, accountId: HexString): Promise<boolean> {
    try {
      await validateVoucher(programId, accountId, this._api);
    } catch (_) {
      return false;
    }
    return true;
  }
}
