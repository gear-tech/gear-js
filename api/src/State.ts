import { CreateType } from './CreateType';
import { getWasmMetadata } from './WasmMeta';
import { IGearPages, ProgramId } from './interfaces';
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
  async decodeState(metaWasm: Buffer, pages: IGearPages, encodedInput?: Uint8Array): Promise<Codec> {
    const meta = await getWasmMetadata(metaWasm, true, pages, encodedInput);
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
   * Encode input parameters to read meta state
   * @param metaWasm - file with metadata
   * @param inputValue - input parameters
   * @returns ArrayBuffer with encoded data
   */
  async encodeInput(metaWasm: Buffer, inputValue: any): Promise<Uint8Array> {
    const meta = await getWasmMetadata(metaWasm);
    const encoded = CreateType.encode(meta.meta_state_input, inputValue, meta);
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

    const encodedInput = inputValue !== undefined ? await this.encodeInput(metaWasm, inputValue) : undefined;

    return await this.decodeState(metaWasm, pages, encodedInput);
  }
}
