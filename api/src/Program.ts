import { AnyJson, AnyNumber, ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BalanceOf } from '@polkadot/types/interfaces';
import { randomAsHex } from '@polkadot/util-crypto';
import { Bytes, u64 } from '@polkadot/types';

import { createPayload, generateProgramId, GPROG, GPROG_HEX } from './utils';
import { Metadata } from './types/interfaces';
import { GearTransaction } from './Transaction';
import { SubmitProgramError } from './errors';
import { GearApi } from './GearApi';
import { GearGas } from './Gas';
import { Hex } from './types';

export class GearProgram extends GearTransaction {
  calculateGas: GearGas;

  constructor(gearApi: GearApi) {
    super(gearApi);
    this.calculateGas = new GearGas(gearApi);
  }
  /**
   * @param program Upload program data
   * @param meta Metadata
   * @returns ProgramId
   * @example
   * ```javascript
   * const code = fs.readFileSync('path/to/program.opt.wasm');
   * const meta = await getWasmMetadata(fs.readFileSync('path/to/program.meta.wasm'));
   * const api = await GearApi.create();
   * const { programId, salt, submitted } = api.program.submit({
   *   code,
   *   initPayload: {field: 'someValue'},
   *   gasLimit: 20_000_000,
   * }, meta)
   * api.program.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  submit(
    program: {
      code: Buffer | Uint8Array;
      salt?: `0x${string}`;
      initPayload?: AnyJson;
      gasLimit: u64 | AnyNumber;
      value?: BalanceOf | AnyNumber;
    },
    meta?: Metadata,
    messageType?: string,
  ): { programId: Hex; salt: Hex; submitted: SubmittableExtrinsic<'promise', ISubmittableResult> } {
    const salt = program.salt || randomAsHex(20);
    const code = this.createType.create('bytes', Array.from(program.code)) as Bytes;
    const payload = createPayload(this.createType, messageType || meta?.init_input, program.initPayload, meta);
    try {
      this.submitted = this.api.tx.gear.submitProgram(code, salt, payload, program.gasLimit, program.value || 0);
      const programId = generateProgramId(code, salt);
      return { programId, salt, submitted: this.submitted };
    } catch (error) {
      throw new SubmitProgramError();
    }
  }

  /**
   * Get ids of all uploaded programs
   * @returns
   */
  async allUploadedPrograms(): Promise<Hex[]> {
    const keys = await this.api.rpc.state.getKeys(GPROG);
    return keys.map((prog) => {
      return `0x${prog.toHex().slice(GPROG_HEX.length + 2)}` as Hex;
    });
  }

  /**
   *
   * @param id some address in hex format
   * @returns if address belongs to program, method returns `true`, otherwise `false`
   */
  async is(id: Hex): Promise<boolean> {
    const progs = await this.api.rpc.state.getKeys(GPROG);
    return progs.find((prog) => prog.eq(`0x${GPROG_HEX}${id.slice(2)}`)) ? true : false;
  }
}
