import { Option } from '@polkadot/types';
import { u8aToU8a } from '@polkadot/util';

import { ActiveProgram, Hex, IGearPages, IProgram } from './types';
import { ProgramDoesNotExistError, ProgramExitedError, ProgramTerminatedError } from './errors';
import { GearApi } from './GearApi';

export class GearProgramStorage {
  constructor(protected _api: GearApi) {}

  /**
   * Get program from chain
   * @param programId
   * @returns
   */
  async getProgram(programId: Hex): Promise<ActiveProgram> {
    const storage = (await this._api.query.gearProgram.programStorage(programId)) as Option<IProgram>;

    if (storage.isNone) {
      throw new ProgramDoesNotExistError();
    }

    const program = storage.unwrap();

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
  async getProgramPages(programId: Hex, program: ActiveProgram): Promise<IGearPages> {
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
}
