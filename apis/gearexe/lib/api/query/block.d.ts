import { BlockHeader, IGearExeProvider } from '../../types/index.js';
export declare class Block {
    private _provider;
    constructor(_provider: IGearExeProvider);
    header(hash?: string): Promise<BlockHeader>;
}
