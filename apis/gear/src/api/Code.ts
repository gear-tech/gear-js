import { Bytes, Option } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';
import { u8aToHex } from '@polkadot/util';

import { CodeUploadResult, GearCommonCodeMetadata, GearCoreCodeInstrumentedInstrumentedCode } from '../types';
import { generateCodeHash, getIdsFromKeys, validateCodeId } from '../utils';
import { CodeDoesNotExistError } from '../errors';
import { GearTransaction } from './Transaction';
import { getGrReply } from '../wasm';

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
  async exists(codeId: string) {
    const codeMetadata = (await this._api.query.gearProgram.metadataStorage(codeId)) as Option<GearCommonCodeMetadata>;
    return codeMetadata.isSome;
  }

  /**
   * ### Get code storage
   * @param codeId
   */
  async storage(codeId: HexString): Promise<Option<GearCoreCodeInstrumentedInstrumentedCode>> {
    return this._api.query.gearProgram.codeStorage(codeId);
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
  async all(): Promise<HexString[]> {
    const prefix = this._api.query.gearProgram.metadataStorage.keyPrefix();
    const keys = await this._api.rpc.state.getKeys(prefix);
    const codeIds = getIdsFromKeys(keys, prefix);

    return codeIds;
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
