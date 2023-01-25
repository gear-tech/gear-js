import { Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { randomAsHex } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

import { GPROG, GPROG_HEX, generateCodeHash, generateProgramId, validateGasLimit, validateValue } from './utils';
import { IProgramCreateOptions, IProgramCreateResult, IProgramUploadOptions, IProgramUploadResult } from './types';
import { ProgramMetadata, isProgramMeta } from './metadata';
import { GearApi } from './GearApi';
import { GearGas } from './Gas';
import { GearTransaction } from './Transaction';
import { OldMetadata } from './types/interfaces';
import { SubmitProgramError } from './errors';
import { encodePayload } from './utils/create-payload';

export class GearProgram extends GearTransaction {
  public calculateGas: GearGas;

  constructor(protected _api: GearApi) {
    super(_api);
    this.calculateGas = new GearGas(_api);
  }

  /**
   * ### Upload program with code using program metadata to encode payload
   * @param args Program parameters
   * @param meta (optional) Program metadata obtained using `getProgramMetadata` function.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.init.input` will be used instead.
   * @returns Object containing program id, generated (or specified) salt, code id, prepared extrinsic
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * const code = fs.readFileSync('path/to/program.opt.wasm');
   * cosnt hexMeta = '0x...';
   * const meta = getProgramMetadata(hexMeta);
   * const { programId, codeId, salt, extrinsic } = api.program.upload({
   *   code,
   *   initPayload: { field: 'someValue' },
   *   gasLimit: 20_000_000,
   * }, meta, meta.init.input);
   * api.program.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  upload(args: IProgramUploadOptions, meta?: ProgramMetadata, typeIndex?: number): IProgramUploadResult;

  /**
   * @deprecated This method will ber removed as soon as we move completely to the new metadata
   */
  upload(args: IProgramUploadOptions, meta?: OldMetadata, messageType?: string): IProgramUploadResult;

  /**
   * ### Upload program with code using registry in hex format to encode payload
   * @param args Program parameters
   * @param hexRegistry Registry presented as Hex string
   * @param typeIndex Index of type in the registry.
   * @returns Object containing program id, generated (or specified) salt, code id, prepared extrinsic
   */
  upload(args: IProgramUploadOptions, hexRegistry: HexString, typeIndex: number): IProgramUploadResult;

  upload(
    args: IProgramUploadOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): IProgramUploadResult;

  /** ### Upload program with code
   * @param args
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrMessageType type index in registry or type name
   */
  upload(
    args: IProgramUploadOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString | OldMetadata,
    typeIndexOrTypeName?: number | string,
  ): IProgramUploadResult {
    validateValue(args.value, this._api);
    validateGasLimit(args.gasLimit, this._api);

    const salt = args.salt || randomAsHex(20);
    const code = this._api.createType('Bytes', Array.from(args.code)) as Bytes;

    const payload = encodePayload(
      args.initPayload,
      metaOrHexRegistry,
      isProgramMeta(metaOrHexRegistry) ? 'init' : 'init_input',
      typeIndexOrTypeName,
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

  /**
   * ### Create program from uploaded on chain code using program metadata to encode payload
   * @param args Program parameters
   * @param meta (optional) Program metadata obtained using `getProgramMetadata` function.
   * @param typeIndex (optional) Index of type in the registry. If not specified the type index from `meta.init.input` will be used instead.
   * @returns Object containing program id, generated (or specified) salt, prepared extrinsic
   * @example
   * ```javascript
   * const api = await GearApi.create();
   * const codeId = '0x...';
   * cosnt hexMeta = '0x...';
   * const meta = getProgramMetadata(hexMeta);
   * const { programId, codeId, salt, extrinsic } = api.program.create({
   *   code,
   *   initPayload: { field: 'someValue' },
   *   gasLimit: 20_000_000,
   * }, meta, meta.init.input);
   * api.program.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  create(args: IProgramCreateOptions, meta?: ProgramMetadata, typeIndex?: number): IProgramCreateResult;

  /**
   * @deprecated This method will be removed as soon as we move completely to the new metadata
   */
  create(args: IProgramCreateOptions, meta?: OldMetadata, messageType?: string): IProgramCreateResult;

  /**
   * ### Create program from uploaded on chain code using program metadata to encode payload
   * @param args Program parameters
   * @param hexRegistry Registry presented as Hex string
   * @param typeIndex Index of type in the registry.
   * @returns Object containing program id, generated (or specified) salt, prepared extrinsic
   */
  create(args: IProgramCreateOptions, hexRegistry: HexString, typeIndex: number): IProgramCreateResult;

  create(
    args: IProgramCreateOptions,
    metaOrHexRegistry?: HexString | ProgramMetadata | OldMetadata,
    typeIndexOrMessageType?: number | string,
  ): IProgramCreateResult;

  /** ## Create program using existed codeId
   * @param args
   * @param metaOrHexRegistry Metadata
   * @param typeIndexOrMessageType type index in registry or type name
   */
  create(
    { codeId, initPayload, value, gasLimit, ...args }: IProgramCreateOptions,
    metaOrHexRegistry?: HexString | ProgramMetadata | OldMetadata,
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
   * @returns Array of program ids
   */
  async allUploadedPrograms(): Promise<HexString[]> {
    const keys = await this._api.rpc.state.getKeys(GPROG);
    return keys.map((prog) => {
      return `0x${prog.toHex().slice(GPROG_HEX.length + 2)}` as HexString;
    });
  }

  /**
   *
   * @param id A program id
   * @returns `true` if address belongs to program, and `false` otherwise
   */
  async exists(id: HexString): Promise<boolean> {
    const progs = await this._api.rpc.state.getKeys(GPROG);
    const program = progs.find((prog) => prog.eq(`0x${GPROG_HEX}${id.slice(2)}`));
    return Boolean(program);
  }

  /**
   * Get codeHash of program on-chain
   * @param programId
   * @returns codeHash of the program
   */
  async codeHash(programId: HexString): Promise<HexString> {
    const program = await this._api.storage.gProg(programId);
    return u8aToHex(program.code_hash);
  }

  /**
   * ### Get hash of program metadata
   * @param programId
   * @param at (optional) block hash
   * @returns
   */
  async metaHash(programId: HexString, at?: HexString): Promise<HexString> {
    const metaHash = (await this._api.rpc['gear'].readMetahash(programId, at || null)) as H256;
    return metaHash.toHex();
  }
}
