import { GearApi } from './GearApi';
import { Hex, IGearPages, IProgram, ProgramId } from './interfaces';
import { u32, Option, Raw } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';

const PREFIXES = {
  prog: Buffer.from('g::prog::').toString('hex'),
  pages: Buffer.from('g::pages::').toString('hex'),
};

const SEPARATOR = Buffer.from('::').toString('hex');

export class GearStorage {
  api: GearApi;

  constructor(api: GearApi) {
    this.api = api;
  }
  /**
   * Get program from chain
   * @param programId
   * @returns
   */
  async gProg(programId: ProgramId): Promise<IProgram> {
    const storage = (await this.api.rpc.state.getStorage(`0x${PREFIXES.prog}${programId.slice(2)}`)) as Option<Raw>;
    const decoded: IProgram = this.api.createType('Program', storage.unwrap());
    return decoded;
  }

  /**
   * Get list of pages for program
   * @param programId
   * @param pagesList - list with pages numbers
   * @returns
   */
  async gPages(programId: ProgramId, pagesList: u32[]): Promise<IGearPages> {
    const keys = {};
    pagesList.forEach((value: u32) => {
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
