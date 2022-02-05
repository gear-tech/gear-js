import { Metadata, ProgramId, GetGasSpentOptions } from './interfaces';
import { SubmitProgramError } from './errors';
import { AnyNumber } from '@polkadot/types/types';
import { Bytes, U64, u64 } from '@polkadot/types';
import { H256, BalanceOf } from '@polkadot/types/interfaces';
import { randomAsHex, blake2AsU8a } from '@polkadot/util-crypto';
import { GearTransaction } from './types';
import { createPayload } from './utils';
import { GetGasSpentError } from './errors/program.errors';

export class GearProgram extends GearTransaction {
  /**
   * @param program Uploading program data
   * @param meta Metadata
   * @returns ProgramId
   */
  submit(
    program: {
      code: Buffer;
      salt?: string;
      initPayload?: string | any;
      gasLimit: u64 | AnyNumber;
      value?: BalanceOf | AnyNumber;
    },
    meta?: Metadata,
    messageType?: string,
  ): ProgramId {
    const salt = program.salt || randomAsHex(20);
    const code = this.createType.create('bytes', Array.from(program.code)) as Bytes;
    let payload = createPayload(this.createType, messageType || meta?.init_input, program.initPayload, meta);
    try {
      this.submitted = this.api.tx.gear.submitProgram(code, salt, payload, program.gasLimit, program.value || 0);
      const programId = this.generateProgramId(code, salt);
      return programId.toHex();
    } catch (error) {
      throw new SubmitProgramError();
    }
  }

  /**
   * Get ids of all uploaded programs
   * @returns
   */
  async allUploadedPrograms(): Promise<string[]> {
    let programs = (await this.api.rpc.state.getKeys('g::prog::')).map((prog) => {
      return `0x${prog.toHex().slice(Buffer.from('g::prog::').toString('hex').length + 2)}`;
    });
    return programs;
  }

  /**
   * @param options Options to get gasSpent
   * @param meta Program metadata
   * @returns number in U64 format
   * @example
   * ```javascript
   * const gas = await gearApi.program.getGasSpent({
   *  accountId: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *  programId: '0x63b24c46d63b43659605d29d5c924ff93de13d620c44fe684b7e2f0757cb7602',
   *  payload: 'PING',
   *  kind: 'Handle',
   *  typeOfPayload: 'String'
   * })
   * console.log(gas.toHuman())
   * ```
   */
  async getGasSpent(options: GetGasSpentOptions, meta?: Metadata): Promise<U64> {
    const { accountId, programId, payload, kind, kindReplyOptions, typeOfPayload } = options;
    let type = typeOfPayload;
    if (!typeOfPayload) {
      if (!meta) {
        throw new GetGasSpentError('Impossible to create bytes from payload without specified type or meta');
      }
      switch (kind) {
        case 'Handle':
          type = meta.handle_input;
          break;
        case 'Init':
          type = meta.init_input;
          break;
        case 'Reply':
          type = meta.async_handle_input;
          if (kindReplyOptions?.length < 2) {
            throw new GetGasSpentError(`kindReplyOptions is required parameter when kind is 'Reply'`);
          }
          break;
      }
    }
    const payloadBytes = createPayload(this.createType, type, payload, meta);
    const kindBytes = this.createType.create('HandleKind', kind === 'Reply' ? { Reply: kindReplyOptions } : kind);
    const gasSpent = await this.api.rpc.gear.getGasSpent(accountId, programId, payloadBytes, kindBytes.toHex());
    return gasSpent;
  }

  generateProgramId(code: Bytes, salt: string): H256 {
    const codeArr = this.api.createType('Vec<u8>', code).toU8a();
    const saltArr = this.api.createType('Vec<u8>', salt).toU8a();

    const id = new Uint8Array(codeArr.length + saltArr.length);
    id.set(codeArr);
    id.set(saltArr, codeArr.length);

    return this.api.createType('H256', blake2AsU8a(id, 256));
  }
}
