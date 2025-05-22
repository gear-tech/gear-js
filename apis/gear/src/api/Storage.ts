import { Bytes, Option, u32 } from '@polkadot/types';
import { u8aToNumber } from '@polkadot/util';
import { H256 } from '@polkadot/types/interfaces';
import { HexString } from '@polkadot/util/types';
import { ITuple } from '@polkadot/types-codec/types';

import { GearCoreProgram, GearCoreProgramActiveProgram, IGearPages, PausedProgramBlockAndHash } from '../types';
import {
  PausedProgramDoesNotExistError,
  ProgramDoesNotExistError,
  ProgramExitedError,
  ProgramTerminatedError,
} from '../errors';
import { GearApi } from '../GearApi';

export class GearProgramStorage {
  constructor(protected _api: GearApi) {}

  /**
   * ### Get program from chain
   * @param id Program id
   * @param at _(optional)_ Hash of block to query at
   * @returns
   */
  async getProgram(id: HexString, at?: HexString): Promise<GearCoreProgramActiveProgram> {
    const api = at ? await this._api.at(at) : this._api;
    const programOption = (await api.query.gearProgram.programStorage(id)) as Option<GearCoreProgram>;

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
  async getProgramPages(
    programId: HexString,
    program: GearCoreProgramActiveProgram,
    at?: HexString,
  ): Promise<IGearPages> {
    const pages = {};

    const blockAt = at || (await this._api.rpc.chain.getHeader()).hash.toHex();

    const apiAt = await this._api.at(blockAt);

    const keys = await apiAt.query.gearProgram.memoryPages.keys(programId, program.memoryInfix);

    const pageNumbers = keys.map((k) => {
      const u8aAddr = k.toU8a();
      const page = u8aAddr.slice(u8aAddr.length - 4);
      return u8aToNumber(page, { isLe: true });
    });

    for (let i = 0; i < pageNumbers.length; i++) {
      const page = pageNumbers[i];
      pages[page] = (await this._api.rpc.state.getStorage<Bytes>(keys[i].toHex(), blockAt)).toU8a();
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
