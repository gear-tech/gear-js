import { Option, Vec } from '@polkadot/types';
import { BalanceOf } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { blake2AsHex } from '@polkadot/util-crypto';

import { ICallOptions, IUpdateVoucherParams, IVoucherDetails, PalletGearVoucherInternalVoucherInfo } from './types';
import { decodeAddress, generateVoucherId } from './utils';
import { GearTransaction } from './Transaction';
import { SPEC_VERSION } from './consts';

export class GearVoucher extends GearTransaction {
  /**
   * ### Issue a new voucher for a `user` to be used to pay for sending messages to `program_id` program.
   * @param spender The voucher holder account id.
   * @param value The voucher amount.
   * @param duration (optional) The number of the block until which the voucher is valid. If not specified, the voucher is valid in `api.voucher.minDuration` blocks.
   * @param programs (optional) The list of programs that the voucher can be used for. If not specified, the voucher can be used for any program.
   * @param codeUploading (optional) Whether the voucher can be used for uploading code.
   * @returns The voucher id and the extrinsic to submit.
   *
   * @example
   * ```javascript
   * import { VoucherIssued } from '@gear-js/api';
   * const programId = '0x..';
   * const account = '0x...';
   * const { extrinsic } = await api.voucher.issue(account, programId, 10000);
   * extrinsic.signAndSend(account, ({ events, status }) => {
   *   if (status.isInBlock) {
   *     const voucherIssuedEvent = events.find(({event: { method }}) => method === 'VoucherIssued')?.event as VoucherIssued;
   *
   *     if (voucherIssuedEvent) {
   *       console.log('voucherId:', voucherIssuedEvent.data.voucherId);
   *     }
   *   }
   * })
   * ```
   */
  async issue(
    spender: HexString,
    value: number | bigint | BalanceOf | string,
    duration?: number,
    programs?: HexString[],
    codeUploading = false,
  ): Promise<{ extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>; voucherId: HexString }> {
    const nonce = await this._api.query.gearVoucher.issued();

    const nextNonce = nonce.unwrapOrDefault().addn(1).toArray('le', 8);
    const voucherId = generateVoucherId(nextNonce);

    this.extrinsic = this._api.tx.gearVoucher.issue(
      spender,
      value,
      programs || null,
      codeUploading,
      duration || this.minDuration,
    );
    return { extrinsic: this.extrinsic, voucherId };
  }

  /**
   * Issue a new voucher. This method is available only for runtime versions < 1100.
   * @deprecated
   * @param to
   * @param program
   * @param value
   * @returns
   */
  issueDeprecated(
    to: HexString,
    program: HexString,
    value: number | bigint | string,
  ): { extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>; voucherId: HexString } {
    const id = generateVoucherId(to, program);

    const voucherId = blake2AsHex(id, 256);
    this.extrinsic = this._api.tx.gearVoucher.issue.call(this, to, program, value);
    return { extrinsic: this.extrinsic, voucherId };
  }

  /**
   * ### Use a voucher to send a message to a program.
   * @param voucherId The id of the voucher to be used.
   * @param params Either `SendMessage` or `SendReply` call options.
   * @returns Extrinsic to submit
   * @example
   * ```javascript
   * const programId = '0x..';
   * const voucherId = '0x...';
   * const msgTx = api.message.send(...);
   * const tx = api.voucher.call(voucherId, { SendMessage: msgTx });
   * tx.signAndSend(account, (events) => {
   *  events.forEach(({ event }) => console.log(event.toHuman()));
   * })
   * ```
   */
  call(voucherId: string, params: ICallOptions): SubmittableExtrinsic<'promise', ISubmittableResult> {
    if ('SendMessage' in params) {
      if (params.SendMessage.method.method !== 'sendMessage') {
        throw new Error(
          `Invalid method name. Expected 'SendMessage' but actual is ${params.SendMessage.method.method}`,
        );
      }
      const [destination, payload, gasLimit, value, keepAlive] = params.SendMessage.args;
      return this._api.tx.gearVoucher.call(voucherId, {
        SendMessage: { destination, payload, gasLimit, value, keepAlive },
      });
    }
    if ('SendReply' in params) {
      if (params.SendReply.method.method !== 'sendReply') {
        throw new Error(`Invalid method name. Expected 'SendReply' but actual is ${params.SendReply.method.method}`);
      }
      const [replyToId, payload, gasLimit, value, keepAlive] = params.SendReply.args;
      return this._api.tx.gearVoucher.call(voucherId, {
        SendReply: { replyToId, payload, gasLimit, value, keepAlive },
      });
    }
    if ('UploadCode' in params) {
      if (params.UploadCode.method.method !== 'uploadCode') {
        throw new Error(`Invalid method name. Expected 'UploadCode' but actual is ${params.UploadCode.method.method}`);
      }

      const [code] = params.UploadCode.args;

      return this._api.tx.gearVoucher.call(voucherId, {
        UploadCode: { code },
      });
    }
    if ('DeclineVoucher' in params) {
      return this._api.tx.gearVoucher.call(voucherId, { DeclineVoucher: null });
    }

    throw new Error('Invalid call params');
  }

  /**
   * Use a voucher to send a message to a program. This method is available only for runtime versions < 1100.
   * @deprecated
   * @param params
   * @returns
   */
  callDeprecated(params: ICallOptions): SubmittableExtrinsic<'promise', ISubmittableResult> {
    if ('SendMessage' in params) {
      if (params.SendMessage.method.method !== 'sendMessage') {
        throw new Error(
          `Invalid method name. Expected 'SendMessage' but actual is ${params.SendMessage.method.method}`,
        );
      }
      const [destination, payload, gasLimit, value, keepAlive] = params.SendMessage.args;
      return this._api.tx.gearVoucher.call.call(this, {
        SendMessage: { destination, payload, gasLimit, value, keepAlive },
      });
    } else if ('SendReply' in params) {
      if (params.SendReply.method.method !== 'sendReply') {
        throw new Error(`Invalid method name. Expected 'SendReply' but actual is ${params.SendReply.method.method}`);
      }
      const [replyToId, payload, gasLimit, value, keepAlive] = params.SendReply.args;
      return this._api.tx.gearVoucher.call.call(this, {
        SendReply: { replyToId, payload, gasLimit, value, keepAlive },
      });
    }

    throw new Error('Invalid call params');
  }

  /**
   * ### Revoke a voucher.
   * @param spender The voucher holder account id.
   * @param voucherId The id of the voucher to be revoked.
   * @returns Extrinsic to submit
   * @example
   * ```javascript
   * const spenderId = '0x...'
   * api.voucher.revoke(spenderId, voucherId).signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()));
   * });
   * ```
   */
  revoke(spender: string, voucherId: string): SubmittableExtrinsic<'promise', ISubmittableResult> {
    return this._api.tx.gearVoucher.revoke(spender, voucherId);
  }

  /**
   * ### Update a voucher.
   * @param spender The voucher holder account id.
   * @param voucherId The id of the voucher to be updated.
   * @param params The update parameters.
   * @returns Extrinsic to submit
   *
   * @example
   * ```javascript
   * const spenderId = '0x...'
   * api.voucher.update(spenderId, voucherId, { balanceTopUp: 100 * 10 ** 12 }).signAndSend(account, (events) => {
   *  events.forEach(({event}) => console.log(event.toHuman()));
   * });
   * ```
   */
  update(
    spender: string,
    voucherId: string,
    params: IUpdateVoucherParams,
  ): SubmittableExtrinsic<'promise', ISubmittableResult> {
    if (
      !params.moveOwnership &&
      !params.balanceTopUp &&
      !params.appendPrograms &&
      !params.prolongDuration &&
      (params.codeUploading === undefined || params.codeUploading === null)
    ) {
      throw new Error('At least one of the parameters must be specified');
    }
    return this._api.tx.gearVoucher.update(
      spender,
      voucherId,
      params.moveOwnership || null,
      params.balanceTopUp || null,
      params.appendPrograms || null,
      params.codeUploading || null,
      params.prolongDuration || null,
    );
  }

  /**
   * ### Decline existing and not expired voucher.
   * @param voucherId The id of the voucher to be declined
   * @returns Extrinsic to submit
   */
  decline(voucherId: string): SubmittableExtrinsic<'promise', ISubmittableResult> {
    return this._api.tx.gearVoucher.decline(voucherId);
  }

  /**
   * ### Check if a voucher exists.
   * @param accountId
   * @param programId
   * @returns
   */
  async exists(accountId: string, programId: HexString): Promise<boolean> {
    if (this._api.specVersion < SPEC_VERSION.V1100) {
      const id = generateVoucherId(decodeAddress(accountId), programId);

      const balance = await this._api.balance.findOut(id);
      if (balance.eqn(0)) {
        return false;
      }
      return true;
    }

    const keyPrefixes = this._api.query.gearVoucher.vouchers.keyPrefix(accountId);

    const keysPaged = await this._api.rpc.state.getKeysPaged(keyPrefixes, 1000, keyPrefixes);

    if (keysPaged.length === 0) {
      return false;
    }

    const vouchers = (await this._api.rpc.state.queryStorageAt(keysPaged)) as Option<any>[];

    return !!vouchers.find((item) => {
      const typedItem = this._api.createType<Option<PalletGearVoucherInternalVoucherInfo>>(
        'Option<PalletGearVoucherInternalVoucherInfo>',
        item,
      );

      if (typedItem.isNone) return false;

      return (typedItem.unwrap().programs.unwrapOrDefault().toJSON() as string[]).includes(programId);
    });
  }

  /**
   * ### Get all vouchers for account.
   * @param accountId
   * @returns
   */
  async getAllForAccount(accountId: string, programId?: HexString): Promise<Record<string, IVoucherDetails>> {
    const result: Record<string, IVoucherDetails> = {};

    const voucherEntries = await this._api.query.gearVoucher.vouchers.entries(accountId);

    if (voucherEntries.length === 0) {
      return result;
    }

    for (const [key, value] of voucherEntries) {
      const voucherId = key.args[1].toHex();
      const details = value.unwrap();

      const programs = details.programs.isSome ? (details.programs.unwrap().toJSON() as string[]) : null;

      if (programId && programs !== null && !programs.includes(programId)) {
        continue;
      }

      result[voucherId] = {
        owner: details.owner.toHex(),
        programs,
        expiry: details.expiry.toNumber(),
        codeUploading: details.codeUploading.isTrue,
      };
    }

    return result;
  }

  /**
   * ### Get all vouchers issued by an account.
   * If many voucher are issued, this may take a while.
   * @param accountId - The account id of the owner of the vouchers.
   * @returns - An array of voucher ids.
   */
  async getAllIssuedByAccount(accountId: string): Promise<string[]> {
    const result: string[] = [];

    const keys = await this._api.query.gearVoucher.vouchers.keys();

    if (keys.length === 0) {
      return result;
    }
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex += 1000) {
      const vouchers = (await this._api.rpc.state.queryStorageAt(keys.slice(keyIndex, keyIndex + 1000))) as Vec<
        Option<PalletGearVoucherInternalVoucherInfo>
      >;

      vouchers.forEach((info, index) => {
        if (info.isNone) {
          return;
        }

        if (!info.unwrap().owner.eq(accountId)) {
          return;
        }

        const voucherId = keys[index + keyIndex].args[1].toHex();

        result.push(voucherId);
      });
    }

    return result;
  }

  /**
   * ### Get voucher details.
   * @param accountId
   * @param voucherId
   * @returns
   */
  async getDetails(accountId: string, voucherId: string): Promise<IVoucherDetails> {
    const voucher = await this._api.query.gearVoucher.vouchers(accountId, voucherId);
    if (voucher.isNone) {
      return null;
    }

    const { owner, programs, expiry, codeUploading } = voucher.unwrap();

    return {
      owner: owner.toHex(),
      programs: programs.isSome ? (programs.unwrap().toJSON() as string[]) : null,
      expiry: expiry.toNumber(),
      codeUploading: codeUploading.isTrue,
    };
  }

  /**
   * ### Minimum duration in blocks voucher could be issued/prolonged for.
   */
  get minDuration(): number {
    return this._api.consts.gearVoucher.minDuration.toNumber();
  }

  /**
   * ### Maximum duration in blocks voucher could be issued/prolonged for.
   */
  get maxDuration(): number {
    return this._api.consts.gearVoucher.maxDuration.toNumber();
  }

  /**
   * ### Maximum amount of programs to be specified to interact with.
   */
  get maxProgramsAmount(): number {
    return this._api.consts.gearVoucher.maxProgramsAmount.toNumber();
  }
}
