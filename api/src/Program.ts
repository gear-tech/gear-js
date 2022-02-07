import { Metadata, ProgramId } from './interfaces';
import { SubmitProgramError } from './errors';
import { AnyNumber } from '@polkadot/types/types';
import { Bytes, U64, u64 } from '@polkadot/types';
import { H256, BalanceOf } from '@polkadot/types/interfaces';
import { randomAsHex, blake2AsU8a } from '@polkadot/util-crypto';
import { GearTransaction } from './types';
import { createPayload } from './utils';

export class GearProgram extends GearTransaction {
  /**
   * @param program Uploading program data
   * @param meta Metadata
   * @returns ProgramId
   */
  submit(
    program: {
      code: Buffer;
      salt?: `0x${string}`;
      initPayload?: string | any;
      gasLimit: u64 | AnyNumber;
      value?: BalanceOf | AnyNumber;
    },
    meta?: Metadata,
    messageType?: string,
  ): { programId: ProgramId; salt: `0x${string}` } {
    const salt = program.salt || randomAsHex(20);
    const code = this.createType.create('bytes', Array.from(program.code)) as Bytes;
    let payload: string = createPayload(this.createType, messageType || meta?.init_input, program.initPayload, meta);
    try {
      this.submitted = this.api.tx.gear.submitProgram(code, salt, payload, program.gasLimit, program.value || 0);
      const programId = this.generateProgramId(code, salt);
      return { programId: programId.toHex(), salt };
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

  async getGasSpent(programId: string, payload: any, type: any, meta?: Metadata): Promise<U64> {
    const payloadBytes = createPayload(this.createType, type, payload, meta);
    const gasSpent = await this.api.rpc.gear.getGasSpent(programId, payloadBytes);
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
