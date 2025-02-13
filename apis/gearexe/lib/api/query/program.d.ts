import { HexString, IGearExeProvider, ProgramState } from '../../types/index.js';
export declare class ProgramQueries {
    private _provider;
    constructor(_provider: IGearExeProvider);
    getIds(): Promise<HexString[]>;
    codeId(programId: string): Promise<HexString>;
    readState(hash: string): Promise<ProgramState>;
}
