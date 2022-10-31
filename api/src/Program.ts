import { randomAsHex } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { Bytes } from '@polkadot/types';

import { IProgramCreateOptions, IProgramCreateResult, IProgramUploadOptions, IProgramUploadResult, Hex } from './types';
import { generateCodeHash, generateProgramId, GPROG, GPROG_HEX, validateGasLimit, validateValue } from './utils';
import { GearTransaction } from './Transaction';
import { createPayload } from './create-type';
import { Metadata } from './types/interfaces';
import { SubmitProgramError } from './errors';
import { GearApi } from './GearApi';
import { GearGas } from './Gas';

export class GearProgram extends GearTransaction {
  public calculateGas: GearGas;

  constructor(protected _api: GearApi) {
    super(_api);
    this.calculateGas = new GearGas(_api);
  }

  /** ### Upload program with code
   * @param program
   * @param meta Metadata
   * @returns ProgramId
   * @example
   * ```javascript
   * const code = fs.readFileSync('path/to/program.opt.wasm');
   * const meta = await getWasmMetadata(fs.readFileSync('path/to/program.meta.wasm'));
   * const api = await GearApi.create();
   * const { programId, codeId, salt, extrinsic } = api.program.upload({
   *   code,
   *   initPayload: {field: 'someValue'},
   *   gasLimit: 20_000_000,
   * }, meta)
   * api.program.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  upload(program: IProgramUploadOptions, meta?: Metadata, messageType?: string): IProgramUploadResult {
    validateValue(program.value, this._api);
    validateGasLimit(program.gasLimit, this._api);

    const salt = program.salt || randomAsHex(20);
    const code = this._api.createType('Bytes', Array.from(program.code)) as Bytes;
    const payload = createPayload(program.initPayload, messageType || meta?.init_input, meta?.types);
    const codeId = generateCodeHash(code);
    const programId = generateProgramId(code, salt);

    try {
      this.extrinsic = this._api.tx.gear.uploadProgram(code, salt, payload, program.gasLimit, program.value || 0);
      return { programId, codeId, salt, extrinsic: this.extrinsic };
    } catch (error) {
      throw new SubmitProgramError();
    }
  }

  /** ## Create program using existed codeId
   * @param program
   * @param meta Metadata
   * @returns ProgramId
   * @example
   * ```javascript
   * const codeId = '0x...';
   * const meta = await getWasmMetadata(fs.readFileSync('path/to/program.meta.wasm'));
   * const api = await GearApi.create();
   * const { programId, salt, extrinsic } = api.program.create({
   *   codeId,
   *   initPayload: { field: 'someValue' },
   *   gasLimit: 20_000_000,
   * }, meta)
   * extrinsic.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  create(program: IProgramCreateOptions, meta?: Metadata, messageType?: string): IProgramCreateResult {
    validateValue(program.value, this._api);
    validateGasLimit(program.gasLimit, this._api);

    const salt = program.salt || randomAsHex(20);
    const payload = createPayload(program.initPayload, messageType || meta?.init_input, meta?.types);
    const programId = generateProgramId(program.codeId, salt);

    try {
      this.extrinsic = this._api.tx.gear.createProgram(
        program.codeId,
        salt,
        payload,
        program.gasLimit,
        program.value || 0,
      );
      return { programId, salt, extrinsic: this.extrinsic };
    } catch (error) {
      throw new SubmitProgramError();
    }
  }

  /**
   * Get ids of all uploaded programs
   * @returns
   */
  async allUploadedPrograms(): Promise<Hex[]> {
    const keys = await this._api.rpc.state.getKeys(GPROG);
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
    const progs = await this._api.rpc.state.getKeys(GPROG);
    const program = progs.find((prog) => prog.eq(`0x${GPROG_HEX}${id.slice(2)}`));
    return Boolean(program);
  }

  /**
   * Get codeHash of program on-chain
   * @param programId
   * @returns codeHash in hex format
   */
  async codeHash(programId: Hex): Promise<Hex> {
    const program = await this._api.storage.gProg(programId);
    return u8aToHex(program.code_hash);
  }
}
