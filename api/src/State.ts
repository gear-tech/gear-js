import { getWasmMetadata, readState } from './wasm';
import { Metadata } from './types/interfaces';
import { ProgramId } from './types';
import { Codec } from '@polkadot/types/types';
import { ReadStateError } from './errors/state.errors';
import { GearStorage } from './Storage';

export class GearProgramState extends GearStorage {
  /**
   * Decode state to meta_state_output type
   * @param state - Uint8Array state representation
   * @param meta - Metadata
   * @returns decoded state
   */
  decodeState(state: Uint8Array, meta: Metadata): Codec {
    if (!state) {
      throw new ReadStateError(`Unable to read state. meta_state function is not specified in metadata`);
    }
    const bytes = this.api.createType('Bytes', Array.from(state));
    const decoded = this.createType.create(meta.meta_state_output, bytes, meta);
    return decoded;
  }

  /**
   * Encode input parameters to read meta state
   * @param meta - Metadata
   * @param inputValue - input parameters
   * @returns ArrayBuffer with encoded data
   */
  encodeInput(meta: Metadata, inputValue: any): Uint8Array {
    const encoded = this.createType.create(meta.meta_state_input, inputValue, meta);
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

    const pages = await this.gPages(programId, program);
    const initialSize = program.allocations.size;
    const block = await this.api.blocks.getFinalizedHead();
    const blockTimestamp = await this.api.blocks.getBlockTimestamp(block.toHex());

    if (!pages) {
      throw new ReadStateError(`Unable to read state. Unable to recieve program pages from chain`);
    }
    const metadata = await getWasmMetadata(metaWasm);
    if (!metadata.meta_state_output) {
      throw new ReadStateError(`Unable to read state. meta_state_output type is not specified in metadata`);
    }
    if (metadata.meta_state_input && inputValue === undefined) {
      throw new ReadStateError(`Unable to read state. inputValue not specified`);
    }
    const encodedInput = inputValue === undefined ? undefined : this.encodeInput(metadata, inputValue);
    const state = await readState(metaWasm, initialSize, pages, encodedInput, blockTimestamp);

    return this.decodeState(state, metadata);
  }
}
