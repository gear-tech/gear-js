import { BaseContract, Provider, Signer } from 'ethers';
interface ApprovalLog {
    owner: string;
    spender: string;
    value: bigint;
}
interface IWrappedVaraContract {
    name: () => Promise<string>;
    symbol: () => Promise<string>;
    decimals: () => Promise<number>;
    balanceOf: (account: string) => Promise<number>;
    totalSupply: () => Promise<number>;
    allowance: (owner: string, spender: string) => Promise<number>;
}
export declare class WrappedVaraContract extends BaseContract {
    constructor(address: string, provider: Provider | Signer);
    approve(address: string, value: bigint): Promise<ApprovalLog>;
}
export declare function getWrappedVaraContract(address: string, provider: Provider | Signer): WrappedVaraContract & IWrappedVaraContract;
export {};
