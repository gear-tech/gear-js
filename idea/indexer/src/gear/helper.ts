import { HexString } from '@polkadot/util/types';

import { GearIndexer } from './indexer';
import { Code, Program } from '../database';

export class GearHelper {
  indexer: GearIndexer;

  initialize(indexer: GearIndexer) {
    this.indexer = indexer;
  }

  async checkProgram(id: HexString): Promise<Program | null> {
    return this.indexer.indexBlockWithMissedProgram(id);
  }

  async checkCode(id: HexString): Promise<Code | null> {
    return this.indexer.indexBlockWithMissedCode(id);
  }
}
