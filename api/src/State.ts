import { CreateType } from './create-type';
import { getWasmMetadata, readState } from './wasm';
import { IGearPages, Metadata, ProgramId } from './interfaces';
import { Codec } from '@polkadot/types/types';
import { ReadStateError } from './errors/state.errors';
import { GearStorage } from './Storage';

export class GearProgramState extends GearStorage {
  /**
   * Decode state to meta_state_output type
   * @param metaWasm - file with metadata
   * @param pages - pages with program state
   * @returns decoded state
   */
  async decodeState(state: Uint8Array, meta: Metadata): Promise<Codec> {
    if (!state) {
      throw new ReadStateError(`Unable to read state. meta_state function is not specified in metadata`);
    }
    const bytes = this.api.createType('Bytes', Array.from(state));
    const decoded = CreateType.create(meta.meta_state_output, bytes, meta);
    return decoded;
  }

  /**
   * Encode input parameters to read meta state
   * @param metaWasm - file with metadata
   * @param inputValue - input parameters
   * @returns ArrayBuffer with encoded data
   */
  async encodeInput(meta: Metadata, inputValue: any): Promise<Uint8Array> {
    const encoded = CreateType.create(meta.meta_state_input, inputValue, meta);
    return encoded.toU8a();
  }

  /**
   * Read state of particular program
   * @param programId
   * @param metaWasm - file with metadata
   * @returns decoded state
   */
  async read(programId: ProgramId, metaWasm: Buffer, inputValue?: any): Promise<Codec> {
    const program = await this.gProg(programId);
    if (!program) {
      throw new ReadStateError('Program is terminated');
    }
    const pages = await this.gPages(programId, program.persistent_pages);
    if (!pages) {
      throw new ReadStateError(`Unable to read state. Unable to recieve program pages from chain`);
    }
    const metadata = await getWasmMetadata(metaWasm);
    if (!metadata.meta_state_output) {
      throw new ReadStateError(`Unable to read state. meta_state_output type is not specified in metadata`);
    }
    const encodedInput = inputValue === undefined ? undefined : await this.encodeInput(metadata, inputValue);
    const state = await readState(metaWasm, pages, encodedInput);

    return await this.decodeState(state, metadata);
  }
}
