import { CreateType, GearApi, getWasmMetadata, IGearPages, IProgram, ProgramId } from '.';
import { u32, Option, Raw } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { ReadStateError } from './errors/state.errors';

const PREFIXES = {
  prog: Buffer.from('g::prog::').toString('hex'),
  pages: Buffer.from('g::pages::').toString('hex'),
};

const SEPARATOR = Buffer.from('::').toString('hex');

export class GearProgramState {
  api: GearApi;

  constructor(api: GearApi) {
    this.api = api;
  }

  /**
   * Get program form chain
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
   * @param pagesList
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
   * Decode state to meta_state_output type
   * @param metaWasm
   * @param pages
   * @returns
   */
  async decodeState(metaWasm: Buffer, pages: IGearPages): Promise<Codec> {
    const meta = await getWasmMetadata(metaWasm, pages);
    if (!meta.meta_state_output) {
      throw new ReadStateError(`Can't read state. meta_state_output type is not specified in metadata`);
    } else if (!meta.meta_state) {
      throw new ReadStateError(`Can't read state. meta_state function is not specified in metadata`);
    }
    const bytes = this.api.createType('Bytes', Array.from(meta.meta_state));
    const decoded = CreateType.decode(meta.meta_state_output, bytes, meta);
    return decoded;
  }

  /**
   * Read state of program
   * @param programId
   * @param metaWasm
   * @returns
   */
  async read(programId: ProgramId, metaWasm: Buffer) {
    const program = await this.gProg(programId);
    const pages = await this.gPages(programId, program.persistent_pages);
    return await this.decodeState(metaWasm, pages);
  }
}
