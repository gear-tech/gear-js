import { CodeMetadata, ProgramMap } from '@gear-js/api';
import { Option } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';

import { GearIndexer } from './indexer';
import { Code, Program } from '../database';

export class GearHelper {
  indexer: GearIndexer;

  initialize(indexer: GearIndexer) {
    this.indexer = indexer;
  }

  async checkProgram(id: HexString): Promise<Program | undefined> {
    const programOp = (await this.indexer.api.query.gearProgram.programStorage(id)) as Option<ProgramMap>;
    if (programOp.isNone) {
      return null;
    }

    const blockNumber = programOp.unwrap()[1].toNumber();
    const [programs] = await this.indexer.indexMissedBlock(blockNumber);

    const program = programs.find(({ id }) => id === id);
    return program;
  }

  async checkCode(id: HexString): Promise<Code | undefined> {
    const codeOp = (await this.indexer.api.query.gearProgram.metadataStorage(id)) as Option<CodeMetadata>;
    if (codeOp.isNone) {
      return null;
    }

    const blockNumber = codeOp.unwrap().blockNumber.toNumber();
    const codes = (await this.indexer.indexMissedBlock(blockNumber))[1];
    const code = codes.find(({ id }) => id === id);

    return code;
  }
}
