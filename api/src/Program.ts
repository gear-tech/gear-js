import { Bytes, Option } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { randomAsHex } from '@polkadot/util-crypto';

import {
  IProgram,
  IProgramCreateOptions,
  IProgramCreateResult,
  IProgramUploadOptions,
  IProgramUploadResult,
} from './types';
import { ProgramDoesNotExistError, ProgramHasNoMetahash, SubmitProgramError } from './errors';
import {
  encodePayload,
  generateCodeHash,
  generateProgramId,
  getIdsFromKeys,
  validateGasLimit,
  validateProgramId,
  validateValue,
} from './utils';
import { GearApi } from './GearApi';
import { GearGas } from './Gas';
import { GearTransaction } from './Transaction';
import { ProgramMetadata } from './metadata';

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
   * ### Upload program with code using registry in hex format to encode payload
   * @param args Program parameters
   * @param hexRegistry Registry presented as Hex string
   * @param typeIndex Index of type in the registry.
   * @returns Object containing program id, generated (or specified) salt, code id, prepared extrinsic
   */
  upload(args: IProgramUploadOptions, hexRegistry: HexString, typeIndex: number): IProgramUploadResult;

  /** ### Upload program with code using type name to encode payload
   * @param args
   * @param metaOrHexRegistry (optional) Metadata or hex registry
   * @param typeName type name (one of the default rust types if metadata or registry don't specified)
   */
  upload(
    args: IProgramUploadOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): IProgramUploadResult;

  upload(
    args: IProgramUploadOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeIndexOrTypeName?: number | string,
  ): IProgramUploadResult {
    validateValue(args.value, this._api);
    validateGasLimit(args.gasLimit, this._api);

    const salt = args.salt || randomAsHex(20);
    const code = this._api.createType('Bytes', Array.from(args.code)) as Bytes;

    const payload = encodePayload(args.initPayload, metaOrHexRegistry, 'init', typeIndexOrTypeName);
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
   * ### Create program from uploaded on chain code using program metadata to encode payload
   * @param args Program parameters
   * @param hexRegistry Registry presented as Hex string
   * @param typeIndex Index of type in the registry.
   * @returns Object containing program id, generated (or specified) salt, prepared extrinsic
   */
  create(args: IProgramCreateOptions, hexRegistry: HexString, typeIndex: number): IProgramCreateResult;

  /** ## Create program using existed codeId
   * @param args
   * @param metaOrHexRegistry (optional) Metadata or hex registry in hex format
   * @param type name type name (one of the default rust types if metadata or registry don't specified)
   */
  create(
    args: IProgramCreateOptions,
    metaOrHexRegistry?: HexString | ProgramMetadata,
    typeName?: number | string,
  ): IProgramCreateResult;

  create(
    { codeId, initPayload, value, gasLimit, ...args }: IProgramCreateOptions,
    metaOrHexRegistry?: HexString | ProgramMetadata,
    typeIndexOrTypeName?: number | string,
  ): IProgramCreateResult {
    validateValue(value, this._api);
    validateGasLimit(gasLimit, this._api);

    const payload = encodePayload(initPayload, metaOrHexRegistry, 'init', typeIndexOrTypeName);
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
   * ### Pay program rent
   * @param programId
   * @param blockCount
   * @returns
   * @example
   * ```javascript
   * const tx = await api.program.payRent('0x...', 100_000);
   * tx.signAndSend(account, (events) => {
   *   events.forEach(({event}) => console.log(event.toHuman()))
   * })
   * ```
   */
  async payRent(
    programId: HexString,
    blockCount: number,
  ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
    await validateProgramId(programId, this._api);
    return this._api.tx.gear.payProgramRent(programId, blockCount);
  }

  /**
   * Get ids of all uploaded programs
   * @returns Array of program ids
   */
  async allUploadedPrograms(count?: number): Promise<HexString[]> {
    const prefix = this._api.query.gearProgram.programStorage.keyPrefix();
    const programIds: HexString[] = [];
    if (count) {
      const keys = await this._api.rpc.state.getKeysPaged(prefix, count);
      programIds.push(...getIdsFromKeys(keys, prefix));
    } else {
      count = 1000;
      const keys = await this._api.rpc.state.getKeysPaged(prefix, count);
      programIds.push(...getIdsFromKeys(keys, prefix));
      let keysLength = keys.length;
      let lastKey = keys.at(-1);
      while (keysLength === count) {
        const keys = await this._api.rpc.state.getKeysPaged(prefix, count, lastKey);
        programIds.push(...getIdsFromKeys(keys, prefix));
        lastKey = keys.at(-1);
        keysLength = keys.length;
      }
    }
    return programIds;
  }

  /**
   *
   * @param id A program id
   * @returns `true` if address belongs to program, and `false` otherwise
   */
  async exists(id: HexString): Promise<boolean> {
    const program = (await this._api.query.gearProgram.programStorage(id)) as Option<IProgram>;
    return program.isSome;
  }

  /**
   * Get codeHash of program on-chain
   * @param programId
   * @returns codeHash of the program
   */
  async codeHash(id: HexString): Promise<HexString> {
    const program = await this._api.programStorage.getProgram(id);

    return program.codeHash.toHex();
  }

  /**
   * ### Get hash of program metadata
   * @param programId
   * @param at (optional) block hash
   * @returns
   */
  async metaHash(programId: HexString, at?: HexString): Promise<HexString> {
    try {
      const metaHash = (await this._api.rpc['gear'].readMetahash(programId, at || null)) as H256;
      return metaHash.toHex();
    } catch (error) {
      if (error.code === 8000) {
        if (error.data.includes('Program not found')) {
          throw new ProgramDoesNotExistError(programId);
        }
        if (error.data.includes('unreachable')) {
          throw new ProgramHasNoMetahash(programId);
        }
      }
      throw error;
    }
  }
}
