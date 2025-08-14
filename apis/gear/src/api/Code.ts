import { Bytes, Option } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';

import {
  CodeUploadResult,
  GearCoreCodeInstrumentedInstrumentedCodeBeforeV1900,
  GearCoreCodeMetadataCodeMetadata,
} from '../types';
import { generateCodeHash, getIdsFromKeys, validateCodeId } from '../utils';
import { CodeDoesNotExistError } from '../errors';
import { GearTransaction } from './Transaction';
import { getGrReply } from '../wasm';
import { SPEC_VERSION } from 'consts';

export class GearCode extends GearTransaction {
  /**
   * ### Submit code without initialization
   * @param code
   * @returns Code hash
   */
  async upload(code: Uint8Array): Promise<CodeUploadResult> {
    const codeHash = generateCodeHash(code);
    await validateCodeId(codeHash, this._api);

    const codeBytes = this._api.createType('Bytes', Array.from(code)) as Bytes;
    this.extrinsic = this._api.tx.gear.uploadCode(codeBytes);
    return { codeHash, submitted: this.extrinsic, extrinsic: this.extrinsic };
  }

  /**
   * ### Check that codeId exists on chain
   * @param codeId
   */
  async exists(codeId: string): Promise<boolean> {
    if (this._api.specVersion >= SPEC_VERSION.V1900) {
      const codeMetadata = await this._api.query.gearProgram.codeMetadataStorage(codeId);
      return codeMetadata.isSome;
    } else {
      const codeMetadata = (await this._api.query.gearProgram.metadataStorage(codeId)) as Option<any>;
      return codeMetadata.isSome;
    }
  }

  private _storageV1900(codeId: HexString): Promise<Option<GearCoreCodeMetadataCodeMetadata>> {
    if (this._api.specVersion >= SPEC_VERSION.V1900) {
      return this._api.query.gearProgram.codeMetadataStorage(codeId);
    } else {
      throw new Error('Unsupported version');
    }
  }

  private _storageBeforeV1900(codeId: HexString): Promise<Option<GearCoreCodeInstrumentedInstrumentedCodeBeforeV1900>> {
    if (this._api.specVersion < SPEC_VERSION.V1900) {
      return this._api.query.gearProgram.codeStorage(codeId);
    } else {
      throw new Error('Unsupported version');
    }
  }

  /**
   * ### Get code storage
   * @param codeId
   * @returns ___[CodeMetadata](https://github.com/gear-tech/gear/blob/master/core/src/code/metadata.rs#L52)___ if connected to the node with version >= 1900,
   * otherwise ___[InstrumentedCode](https://github.com/gear-tech/gear/blob/290c4953a2fd54270ec34333d8cd3f7b97591635/core/src/code/instrumented.rs#L67)___
   */
  async storage(
    codeId: HexString,
  ): Promise<Option<GearCoreCodeMetadataCodeMetadata | GearCoreCodeInstrumentedInstrumentedCodeBeforeV1900>> {
    if (this._api.specVersion >= SPEC_VERSION.V1900) {
      return this._storageV1900(codeId);
    } else {
      return this._storageBeforeV1900(codeId);
    }
  }

  /**
   * ### Get static pages of code
   * @param codeId
   */
  async staticPages(codeId: HexString): Promise<number | null> {
    const storage = await this.storage(codeId);
    return storage.isSome ? storage.unwrap().staticPages.toNumber() : null;
  }

  /**
   * ### Get all ids of codes uploaded on connected chain
   * @returns array of code ids uploaded on chain
   */
  async all(count?: number): Promise<HexString[]> {
    if (this._api.specVersion >= SPEC_VERSION.V1900) {
      const prefix = this._api.query.gearProgram.codeMetadataStorage.keyPrefix();
      const keys = await this._api.rpc.state.getKeysPaged(prefix, count || 1000);

      if (count === undefined) {
        let nextKeysBatch = 1000;

        while (nextKeysBatch === 1000) {
          const _endKeys = await this._api.rpc.state.getKeysPaged(prefix, nextKeysBatch, keys[keys.length - 1]);
          keys.push(..._endKeys);
          nextKeysBatch = _endKeys.length;
        }
      }

      return getIdsFromKeys(keys, prefix);
    } else {
      const prefix = this._api.query.gearProgram.metadataStorage.keyPrefix();
      const keys = await this._api.rpc.state.getKeysPaged(prefix, count || 1000);
      const codeIds = getIdsFromKeys(keys, prefix);
      return codeIds;
    }
  }

  async metaHash(codeId: HexString): Promise<HexString> {
    const code = (await this._api.query.gearProgram.originalCodeStorage(codeId)) as Option<Bytes>;
    if (code.isNone) {
      throw new CodeDoesNotExistError(codeId);
    }

    const metahash = await getGrReply(code.unwrap().toHex(), 'metahash');

    return u8aToHex(metahash);
  }

  async metaHashFromWasm(wasm: ArrayBuffer | HexString | Uint8Array) {
    const metahash = await getGrReply(wasm, 'metahash');

    return u8aToHex(metahash);
  }
}
