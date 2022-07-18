import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Bytes, Option } from '@polkadot/types';

import { GearTransaction } from './Transaction';
import { generateCodeHash, validateCodeId } from './utils';
import { CodeMetadata, CodeStorage, Hex } from './types';
export class GearCode extends GearTransaction {
  /**
   * Submit code without initialization
   * @param code
   * @returns Code hash
   */
  async submit(code: Buffer | Uint8Array): Promise<{ codeHash: Hex; submitted: SubmittableExtrinsic<'promise', ISubmittableResult> }> {
    const codeHash = generateCodeHash(code);
    await validateCodeId(codeHash, this.api);

    const codeBytes = this.createType.create('bytes', Array.from(code)) as Bytes;
    this.submitted = this.api.tx.gear.submitCode(codeBytes);
    return { codeHash, submitted: this.submitted };
  }

  async exists(codeId: string) {
    const codeMetadata = await this.api.query.gearProgram.metadataStorage(codeId) as Option<CodeMetadata>;
    return codeMetadata.isSome;
  }

  async storage(codeId: Hex): Promise<CodeStorage> {
    return this.api.query.gearProgram.codeStorage(codeId) as unknown as CodeStorage;
  }

  async staticPages(codeId: Hex): Promise<number | null> {
    const storage = await this.storage(codeId);
    return storage.isSome ? storage.unwrap().staticPages.toNumber() : null;
  }
}
