import { Option, Raw } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';

import { IActiveProgram, IGearPages, IProgram } from './types/interfaces';
import { GPAGES_HEX, GPROG_HEX, SEPARATOR } from './utils';
import { CreateType } from './create-type';
import { Hex, ProgramId } from './types';
import { ReadStateError } from './errors';
import { GearApi } from './GearApi';

export class GearStorage {
  api: GearApi;
  createType: CreateType;

  constructor(api: GearApi) {
    this.api = api;
    this.createType = new CreateType(api);
  }
  /**
   * Get program from chain
   * @param programId
   * @returns
   */
  async gProg(programId: ProgramId): Promise<IActiveProgram> {
    const storage = (await this.api.rpc.state.getStorage(`0x${GPROG_HEX}${programId.slice(2)}`)) as Option<Raw>;
    if (storage.isNone) {
      throw new ReadStateError(`Program with id ${programId} was not found in the storage`);
    }
    const program = this.api.createType('Program', storage.unwrap()) as IProgram;
    return program.isActive ? program.asActive : program.asTerminated;
  }

  /**
   * Get list of pages for program
   * @param programId
   * @param gProg
   * @returns
   */
  async gPages(programId: ProgramId, gProg: IActiveProgram): Promise<IGearPages> {
    const keys = {};
    gProg.pages_with_data.forEach((value) => {
      keys[value.toNumber()] = `0x${GPAGES_HEX}${programId.slice(2)}${SEPARATOR}${this.api
        .createType('Bytes', Array.from(this.api.createType('u32', value).toU8a()))
        .toHex()
        .slice(2)}`;
    });
    const pages = {};
    for (const key of Object.keys(keys)) {
      const storage = ((await this.api.rpc.state.getStorage(keys[key])) as Option<Codec>).unwrap().toU8a();
      pages[key] = storage;
    }
    return pages;
  }

  /**
   * Get codeHash of program on-chain
   * @param programId
   * @returns codeHash in hex format
   */
  async getCodeHash(programId: ProgramId): Promise<Hex> {
    const program = await this.gProg(programId);
    return u8aToHex(program.code_hash);
  }
}
