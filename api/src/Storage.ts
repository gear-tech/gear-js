import { GearApi } from './GearApi';
import { IActiveProgram, IGearPages, IProgram } from './types/interfaces';
import { Hex, ProgramId } from './types';
import { Option, Raw } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';
import { CreateType } from './create-type';

const PREFIXES = {
  prog: Buffer.from('g::prog::').toString('hex'),
  pages: Buffer.from('g::pages::').toString('hex'),
};

const SEPARATOR = Buffer.from('::').toString('hex');

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
    const storage = (await this.api.rpc.state.getStorage(`0x${PREFIXES.prog}${programId.slice(2)}`)) as Option<Raw>;
    const program = this.api.createType('Program', storage.unwrap()) as IProgram;
    return program.isActive ? program.asActive : program.asTerminated;
  }

  /**
   * Get list of pages for program
   * @param programId
   * @param pagesList - list with pages numbers
   * @returns
   */
  async gPages(programId: ProgramId, gProg: IActiveProgram): Promise<IGearPages> {
    const keys = {};
    gProg.persistent_pages.forEach((value) => {
      keys[value.toNumber()] = `0x${PREFIXES.pages}${programId.slice(2)}${SEPARATOR}${this.api
        .createType('Bytes', Array.from(this.api.createType('u32', value).toU8a()))
        .toHex()
        .slice(2)}`;
    });
    const pages = {};
    for (let key of Object.keys(keys)) {
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
