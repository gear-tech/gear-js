import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Bytes, Option } from '@polkadot/types';

import { generateCodeId, validateCodeId } from './utils';
import { CodeMetadata, CodeStorage, Hex } from './types';
import { GearTransaction } from './Transaction';

export class GearCode extends GearTransaction {
  /**
   * Submit code without initialization
   * @param code
   * @returns Code hash
   */
  async upload(
    code: Buffer | Uint8Array,
  ): Promise<{ codeHash: Hex; submitted: SubmittableExtrinsic<'promise', ISubmittableResult> }> {
    const codeHash = generateCodeId(code);
    await validateCodeId(codeHash, this._api);

    const codeBytes = this._api.createType('Bytes', Array.from(code)) as Bytes;
    this.extrinsic = this._api.tx.gear.uploadCode(codeBytes);
    return { codeHash, submitted: this.extrinsic };
  }

  /**
   * Check that codeId exists on chain
   * @param codeId
   * @returns
   */
  async exists(codeId: string) {
    const codeMetadata = (await this._api.query.gearProgram.metadataStorage(codeId)) as Option<CodeMetadata>;
    return codeMetadata.isSome;
  }

  /**
   * Get code storage
   * @param codeId
   * @returns
   */
  async storage(codeId: Hex): Promise<CodeStorage> {
    return this._api.query.gearProgram.codeStorage(codeId) as unknown as CodeStorage;
  }

  /**
   * Get static pages of code
   * @param codeId
   * @returns
   */
  async staticPages(codeId: Hex): Promise<number | null> {
    const storage = await this.storage(codeId);
    return storage.isSome ? storage.unwrap().staticPages.toNumber() : null;
  }
}
