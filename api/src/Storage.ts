import { Option, u32 } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { ITuple } from '@polkadot/types-codec/types';
import { u8aToU8a } from '@polkadot/util';

import { GearCommonActiveProgram, GearCommonProgram, IGearPages, PausedProgramBlockAndHash } from './types';
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
  async getProgram(id: HexString, at?: HexString): Promise<GearCommonActiveProgram> {
    const api = at ? await this._api.at(at) : this._api;
    const programOption = (await api.query.gearProgram.programStorage(id)) as Option<GearCommonProgram>;

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
  async getProgramPages(programId: HexString, program: GearCommonActiveProgram, at?: HexString): Promise<IGearPages> {
    const pages = {};
    for (const page of program.pagesWithData) {
      pages[page.toNumber()] = u8aToU8a(
        await this._api.provider.send('state_getStorage', [
          this._api.query.gearProgram.memoryPageStorage.key(programId, page),
          at,
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
    const storageOption = (await this._api.query.gearProgram.pausedProgramStorage(id, at)) as Option<
      ITuple<[u32, H256]>
    >;

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
