import { Option, Raw } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';

import { ActiveProgram, Hex, IGearPages, IProgram } from './types';
import { GPAGES_HEX, GPROG_HEX, SEPARATOR } from './utils';
import { ProgramExitedError, ProgramTerminatedError, ReadStorageError } from './errors';
import { GearApi } from './GearApi';

export class GearStorage {
  constructor(protected _api: GearApi) {}

  /**
   * Get program from chain
   * @param programId
   * @returns
   */
  async gProg(programId: Hex): Promise<ActiveProgram> {
    const storage = (await this._api.rpc.state.getStorage(`0x${GPROG_HEX}${programId.slice(2)}`)) as Option<Raw>;
    if (storage.isNone) {
      throw new ReadStorageError(`Program with id ${programId} was not found in the storage`);
    }
    const program = this._api.createType('Program', storage.unwrap()) as IProgram;

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
  async gPages(programId: Hex, gProg: ActiveProgram): Promise<IGearPages> {
    const keys = {};
    gProg.pages_with_data.forEach((value) => {
      keys[value.toNumber()] = `0x${GPAGES_HEX}${programId.slice(2)}${SEPARATOR}${this._api
        .createType('Bytes', Array.from(this._api.createType('u32', value).toU8a()))
        .toHex()
        .slice(2)}`;
    });
    const pages = {};
    for (const key of Object.keys(keys)) {
      const storage = ((await this._api.rpc.state.getStorage(keys[key])) as Option<Codec>).unwrap().toU8a();
      pages[key] = storage;
    }
    return pages;
  }
}
