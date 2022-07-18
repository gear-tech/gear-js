import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { randomAsHex } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { Bytes, BTreeSet, u32 } from '@polkadot/types';

import { createPayload, generateProgramId, GPROG, GPROG_HEX, validateGasLimit, validateValue } from './utils';
import { GearTransaction } from './Transaction';
import { Metadata } from './types/interfaces';
import { ProgramDoesNotExistError, SubmitProgramError } from './errors';
import { GearApi } from './GearApi';
import { GearGas } from './Gas';
import { GasLimit, Hex, Value } from './types';

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
      gasLimit: GasLimit;
      value?: Value;
    },
    meta?: Metadata,
    messageType?: string,
  ): { programId: Hex; salt: Hex; submitted: SubmittableExtrinsic<'promise', ISubmittableResult> } {
    validateValue(program.value, this.api);
    validateGasLimit(program.gasLimit, this.api);

    const salt = program.salt || randomAsHex(20);
    const code = this.createType.create('bytes', Array.from(program.code)) as Bytes;
    const payload = createPayload(this.createType, messageType || meta?.init_input, program.initPayload, meta);
    const programId = generateProgramId(code, salt);

    try {
      this.submitted = this.api.tx.gear.submitProgram(code, salt, payload, program.gasLimit, program.value || 0);
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
  async exists(id: Hex): Promise<boolean> {
    const progs = await this.api.rpc.state.getKeys(GPROG);
    const program = progs.find((prog) => prog.eq(`0x${GPROG_HEX}${id.slice(2)}`));
    return Boolean(program);
  }



  /**
   * Get codeHash of program on-chain
   * @param programId
   * @returns codeHash in hex format
   */
  async codeHash(programId: Hex): Promise<Hex> {
    const program = await this.api.storage.gProg(programId);
    return u8aToHex(program.code_hash);
  }

  async allocations(programId: Hex): Promise<BTreeSet<u32>> {
    const program = await this.api.storage.gProg(programId);
    if (!program) {
      throw new ProgramDoesNotExistError();
    }
    return program.allocations;
  }
}
