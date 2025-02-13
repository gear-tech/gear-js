import { HexString, IGearExeProvider, ReplyInfo } from '../../types/index.js';
export declare class ProgramCalls {
    private _provider;
    constructor(_provider: IGearExeProvider);
    calculateReplyForHandle(source: string, programId: string, payload: HexString, value?: bigint): Promise<ReplyInfo>;
    calculateReplyForHandle(source: string, programId: string, payload: HexString, value: bigint, atBlock?: HexString): Promise<ReplyInfo>;
}
