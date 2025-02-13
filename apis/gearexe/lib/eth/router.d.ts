import { Provider, BaseContract, Signer, Wallet, ethers } from 'ethers';
import { HexString } from '../types/index.js';
export declare enum CodeState {
    Unknown = "Unknown",
    ValidationRequested = "ValidationRequested",
    Validated = "Validated"
}
export interface IRouterContract {
    genesisBlockHash(): Promise<HexString>;
    genesisTimestamp(): Promise<bigint>;
    latestCommittedBlockHash(): Promise<HexString>;
    mirrorImpl(): Promise<HexString>;
    mirrorProxyImpl(): Promise<HexString>;
    wrappedVara(): Promise<HexString>;
    programCodeId(programId: string): Promise<HexString>;
    programCodeIds(programIds: string[]): Promise<HexString[]>;
    programsCount(): Promise<number>;
}
export declare class RouterContract extends BaseContract {
    private _wallet;
    constructor(address: string, abi: string[], wallet: Wallet);
    codeState(codeId: string): Promise<CodeState>;
    createBlob(code: Uint8Array): string;
    requestCodeValidationNoBlob(codeId: string, txHash: string): Promise<{
        receipt: ethers.ContractTransactionReceipt;
        waitForCodeGotValidated: () => Promise<boolean>;
    }>;
    requestCodeValidation(code: Uint8Array): Promise<{
        codeId: `0x${string}`;
        receipt: ethers.TransactionReceipt;
        waitForCodeGotValidated: () => Promise<boolean>;
    }>;
    createProgram(codeId: string, salt?: string): Promise<{
        blockNumber: number;
        id: any;
    }>;
}
export declare function getRouterContract(id: string, provider?: Provider | Signer): RouterContract & IRouterContract;
