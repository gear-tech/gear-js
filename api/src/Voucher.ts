import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { generateVoucherId, validateVoucher } from './utils';
import { GearTransaction } from './Transaction';
import { ICallOptions } from './types';

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
   * const account = '0x...';
   * const tx = api.voucher.issue(account, programId, 10000);
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()));
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

  call(params: ICallOptions) {
    if ('SendMessage' in params) {
      if (params.SendMessage.method.method !== 'sendMessage') {
        throw new Error(
          `Invalid method name. Expected 'SendMessage' but actual is ${params.SendMessage.method.method}`,
        );
      }
      const [destination, payload, gasLimit, value, keepAlive] = params.SendMessage.args;
      return this._api.tx.gearVoucher.call({ SendMessage: { destination, payload, gasLimit, value, keepAlive } });
    } else if ('SendReply' in params) {
      if (params.SendReply.method.method !== 'sendReply') {
        throw new Error(`Invalid method name. Expected 'SendReply' but actual is ${params.SendReply.method.method}`);
      }
      const [replyToId, payload, gasLimit, value, keepAlive] = params.SendReply.args;
      return this._api.tx.gearVoucher.call({ SendReply: { replyToId, payload, gasLimit, value, keepAlive } });
    }

    throw new Error('Invalid call params');
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
