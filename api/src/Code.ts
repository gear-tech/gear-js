import { Bytes, Option } from '@polkadot/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

import { CodeMetadata, CodeStorage, Hex } from './types';
import { generateCodeHash, validateCodeId } from './utils';
import { GearTransaction } from './Transaction';

export class GearCode extends GearTransaction {
  /**
   * ### Submit code without initialization
   * @param code
   * @returns Code hash
   */
  async upload(
    code: Buffer | Uint8Array,
  ): Promise<{ codeHash: Hex; submitted: SubmittableExtrinsic<'promise', ISubmittableResult> }> {
    const codeHash = generateCodeHash(code);
    await validateCodeId(codeHash, this._api);

    const codeBytes = this._api.createType('Bytes', Array.from(code)) as Bytes;
    this.extrinsic = this._api.tx.gear.uploadCode(codeBytes);
    return { codeHash, submitted: this.extrinsic };
  }

  /**
   * ### Check that codeId exists on chain
   * @param codeId
   */
  async exists(codeId: string) {
    const codeMetadata = (await this._api.query.gearProgram.metadataStorage(codeId)) as Option<CodeMetadata>;
    return codeMetadata.isSome;
  }

  /**
   * ### Get code storage
   * @param codeId
   */
  async storage(codeId: Hex): Promise<CodeStorage> {
    return this._api.query.gearProgram.codeStorage(codeId) as unknown as CodeStorage;
  }

  /**
   * ### Get static pages of code
   * @param codeId
   */
  async staticPages(codeId: Hex): Promise<number | null> {
    const storage = await this.storage(codeId);
    return storage.isSome ? storage.unwrap().staticPages.toNumber() : null;
  }

  /**
   * ### Get all ids of codes uploaded on connected chain
   * @returns array of code ids uploaded on chain
   */
  async all(): Promise<Hex[]> {
    const keyPrefix = this._api.query.gearProgram.metadataStorage.keyPrefix();
    const codeMetadata = await this._api.rpc.state.getKeys(keyPrefix);
    const codeIds = codeMetadata.map((key) => '0x' + key.toHex().slice(keyPrefix.length)) as Hex[];

    return codeIds;
  }
}
