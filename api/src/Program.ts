import { Hex, Metadata, ProgramId } from './interfaces';
import { SubmitProgramError } from './errors';
import { AnyNumber } from '@polkadot/types/types';
import { Bytes, u64 } from '@polkadot/types';
import { BalanceOf } from '@polkadot/types/interfaces';
import { randomAsHex } from '@polkadot/util-crypto';
import { GearTransaction } from './types';
import { createPayload, generateProgramId } from './utils';
import { GearGasSpent } from './GasSpent';
import { GearApi } from './GearApi';

export class GearProgram extends GearTransaction {
  gasSpent: GearGasSpent;

  constructor(gearApi: GearApi) {
    super(gearApi);
    this.gasSpent = new GearGasSpent(gearApi);
  }
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
  ): { programId: ProgramId; salt: Hex } {
    const salt = program.salt || randomAsHex(20);
    const code = this.createType.create('bytes', Array.from(program.code)) as Bytes;
    let payload = createPayload(this.createType, messageType || meta?.init_input, program.initPayload, meta);
    try {
      this.submitted = this.api.tx.gear.submitProgram(code, salt, payload, program.gasLimit, program.value || 0);
      const programId = generateProgramId(code, salt);
      return { programId, salt };
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
}
