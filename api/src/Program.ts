import { HexString } from '@polkadot/util/types';
import { randomAsHex } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { Bytes } from '@polkadot/types';

import { IProgramCreateOptions, IProgramCreateResult, IProgramUploadOptions, IProgramUploadResult } from './types';
import { generateCodeHash, generateProgramId, GPROG, GPROG_HEX, validateGasLimit, validateValue } from './utils';
import { HumanProgramMetadata, OldMetadata } from './types/interfaces';
import { GearTransaction } from './Transaction';
import { encodePayload } from './create-type';
import { SubmitProgramError } from './errors';
import { isProgramMeta } from './metadata';
import { GearApi } from './GearApi';
import { GearGas } from './Gas';

export class GearProgram extends GearTransaction {
  public calculateGas: GearGas;

  constructor(protected _api: GearApi) {
    super(_api);
    this.calculateGas = new GearGas(_api);
  }

  upload(args: IProgramUploadOptions, meta?: HumanProgramMetadata, typeIndex?: number): IProgramUploadResult;

  /**
   * @deprecated This method will ber removed as soon as we move completely to the new metadata
   */
  upload(args: IProgramUploadOptions, meta?: OldMetadata, messageType?: string): IProgramUploadResult;

  upload(args: IProgramUploadOptions, hexRegistry?: HexString, typeIndex?: number): IProgramUploadResult;

  upload(
    args: IProgramUploadOptions,
    metaOrHexRegistry?: HexString,
    typeIndexOrMessageType?: number | string,
  ): IProgramUploadResult;

  /** ### Upload program with code
   * @param args
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrMessageType type index in registry or type name
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
  upload(
    args: IProgramUploadOptions,
    metaOrHexRegistry?: HumanProgramMetadata | HexString | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): IProgramUploadResult {
    validateValue(args.value, this._api);
    validateGasLimit(args.gasLimit, this._api);

    const salt = args.salt || randomAsHex(20);
    const code = this._api.createType('Bytes', Array.from(args.code)) as Bytes;

    const payload = encodePayload(
      args.initPayload,
      metaOrHexRegistry,
      isProgramMeta(metaOrHexRegistry) ? 'init' : 'init_input',
      typeIndexOrMessageType,
    );
    const codeId = generateCodeHash(code);
    const programId = generateProgramId(code, salt);

    try {
      this.extrinsic = this._api.tx.gear.uploadProgram(code, salt, payload, args.gasLimit, args.value || 0);
      return { programId, codeId, salt, extrinsic: this.extrinsic };
    } catch (error) {
      throw new SubmitProgramError();
    }
  }

  create(args: IProgramCreateOptions, meta?: HumanProgramMetadata, typeIndex?: number): IProgramCreateResult;

  /**
   * @deprecated This method will ber removed as soon as we move completely to the new metadata
   */
  create(args: IProgramCreateOptions, meta?: OldMetadata, messageType?: string): IProgramCreateResult;

  create(args: IProgramCreateOptions, hexRegistry?: HexString, typeIndex?: number): IProgramCreateResult;

  create(
    args: IProgramCreateOptions,
    metaOrHexRegistry?: HexString | HumanProgramMetadata | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): IProgramCreateResult;

  /** ## Create program using existed codeId
   * @param args
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrMessageType type index in registry or type name
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
  create(
    { codeId, initPayload, value, gasLimit, ...args }: IProgramCreateOptions,
    metaOrHexRegistry?: HexString | HumanProgramMetadata | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): IProgramCreateResult {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    const payload = encodePayload(
      initPayload,
      metaOrHexRegistry,
      isProgramMeta(metaOrHexRegistry) ? 'init' : 'init_input',
      typeIndexOrMessageType,
    );
    const salt = args.salt || randomAsHex(20);

    const programId = generateProgramId(codeId, salt);

    try {
      this.extrinsic = this._api.tx.gear.createProgram(codeId, salt, payload, gasLimit, value || 0);
      return { programId, salt, extrinsic: this.extrinsic };
    } catch (error) {
      throw new SubmitProgramError();
    }
  }

  /**
   * Get ids of all uploaded programs
   * @returns
   */
  async allUploadedPrograms(): Promise<HexString[]> {
    const keys = await this._api.rpc.state.getKeys(GPROG);
    return keys.map((prog) => {
      return `0x${prog.toHex().slice(GPROG_HEX.length + 2)}` as HexString;
    });
  }

  /**
   *
   * @param id some address in hex format
   * @returns if address belongs to program, method returns `true`, otherwise `false`
   */
  async exists(id: HexString): Promise<boolean> {
    const progs = await this._api.rpc.state.getKeys(GPROG);
    const program = progs.find((prog) => prog.eq(`0x${GPROG_HEX}${id.slice(2)}`));
    return Boolean(program);
  }

  /**
   * Get codeHash of program on-chain
   * @param programId
   * @returns codeHash in hex format
   */
  async codeHash(programId: HexString): Promise<HexString> {
    const program = await this._api.storage.gProg(programId);
    return u8aToHex(program.code_hash);
  }
}
