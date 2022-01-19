/// <reference types="node" />
import { GearApi, IGearPages, IProgram, ProgramId } from '.';
import { u32 } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
export declare class GearProgramState {
    api: GearApi;
    constructor(api: GearApi);
    /**
     * Get program form chain
     * @param programId
     * @returns
     */
    gProg(programId: ProgramId): Promise<IProgram>;
    /**
     * Get list of pages for program
     * @param programId
     * @param pagesList - list with pages numbers
     * @returns
     */
    gPages(programId: ProgramId, pagesList: u32[]): Promise<IGearPages>;
    /**
     * Decode state to meta_state_output type
     * @param metaWasm - file with metadata
     * @param pages - pages with program state
     * @returns decoded state
     */
    decodeState(metaWasm: Buffer, pages: IGearPages, encodedInput?: Uint8Array): Promise<Codec>;
    /**
     * Encode input parameters to read meta state
     * @param metaWasm - file with metadata
     * @param inputValue - input parameters
     * @returns ArrayBuffer with encoded data
     */
    encodeInput(metaWasm: Buffer, inputValue: any): Promise<Uint8Array>;
    /**
     * Read state of program
     * @param programId
     * @param metaWasm - file with metadata
     * @returns decoded state
     */
    read(programId: ProgramId, metaWasm: Buffer, inputValue?: any): Promise<Codec>;
}
