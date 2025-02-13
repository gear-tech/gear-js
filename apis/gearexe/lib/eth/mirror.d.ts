import { Provider, BaseContract, Signer, EventLog } from 'ethers';
import { HexString } from '../types/index.js';
export interface MessageQueuingRequestedLog {
    id: HexString;
    source: HexString;
    payload: string;
    value: bigint;
}
export interface ExecutableBalanceTopUpRequestedLog {
    value: bigint;
}
export interface ReplyQueueingRequestedLog {
    repliedTo: HexString;
    source: HexString;
    payload: string;
    value: bigint;
}
export interface MessageQueueingRequestedLog {
    id: HexString;
    source: HexString;
    payload: string;
    value: bigint;
}
export interface IMirrorContract {
    decoder(): Promise<HexString>;
    router(): Promise<HexString>;
    stateHash(): Promise<HexString>;
    nonce(): Promise<number>;
    inheritor(): Promise<HexString>;
}
export interface Reply {
    payload: HexString;
    value: bigint;
    replyCode: string;
    blockNumber: number;
    txHash: HexString;
}
export declare class MirrorContract extends BaseContract {
    constructor(address: string, wallet: Provider | Signer);
    sendMessage(payload: string, value: bigint | number): Promise<{
        txHash: string;
        blockNumber: number;
        message: MessageQueuingRequestedLog;
        waitForReply: Promise<Reply>;
    }>;
    sendReply(payload: string, value: bigint): Promise<EventLog | import("ethers").Log>;
    claimValue(claimedId: string): Promise<MessageQueuingRequestedLog>;
    executableBalanceTopUp(value: bigint): Promise<ExecutableBalanceTopUpRequestedLog>;
}
export declare function getMirrorContract(id: string, provider?: Provider | Signer): MirrorContract & IMirrorContract;
