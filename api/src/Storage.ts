import { HexString } from '@polkadot/util/types';
import { Option } from '@polkadot/types';
import { u8aToU8a } from '@polkadot/util';

import { ActiveProgram, IGearPages, IProgram, PausedProgramBlockAndHash, PausedProgramMapValue } from './types';
import {
  PausedProgramDoesNotExistError,
  ProgramDoesNotExistError,
  ProgramExitedError,
  ProgramTerminatedError,
} from './errors';
import { GearApi } from './GearApi';

export class GearProgramStorage {
  constructor(protected _api: GearApi) {}

  /**
   * ### Get program from chain
   * @param id Program id
   * @param at _(optional)_ Hash of block to query at
   * @returns
   */
  async getProgram(id: HexString, at?: HexString): Promise<ActiveProgram> {
    const programOption = (await this._api.query.gearProgram.programStorage(id, at)) as Option<IProgram>;

    if (programOption.isNone) {
      throw new ProgramDoesNotExistError(id);
    }

    const program = programOption.unwrap();

    if (program.isTerminated) throw new ProgramTerminatedError(program.asTerminated.toHex());

    if (program.isExited) throw new ProgramExitedError(program.asExited.toHex());

    return program.asActive;
  }

  /**
   * Get list of pages for program
   * @param programId
   * @param gProg
   * @returns
   */
  async getProgramPages(programId: HexString, program: ActiveProgram): Promise<IGearPages> {
    const pages = {};
    for (const page of program.pagesWithData) {
      pages[page.toNumber()] = u8aToU8a(
        await this._api.provider.send('state_getStorage', [
          this._api.query.gearProgram.memoryPageStorage.key(programId, page),
        ]),
      );
    }
    return pages;
  }

  /**
   * ### Get block number and hash of paused program
   * @param id paused program id
   * @param at _(optional)_ Hash of block to query at
   * @returns
   */
  async getPausedProgramHashAndBlockNumber(id: HexString, at?: HexString): Promise<PausedProgramBlockAndHash> {
    const storageOption = (await this._api.query.gearProgram.pausedProgramStorage(
      id,
      at,
    )) as Option<PausedProgramMapValue>;

    if (storageOption.isNone) {
      throw new PausedProgramDoesNotExistError(id);
    }

    const storage = storageOption.unwrap();

    return {
      blockNumber: storage[0],
      hash: storage[1],
    };
  }
}
