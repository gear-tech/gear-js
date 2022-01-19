import { Vec, Bytes, u8, u32, u64, Null, Map } from '@polkadot/types';
export declare interface Reason extends Bytes {
    isError: Boolean;
    asError: Null;
    isValueTransfer: Boolean;
    asValueTransfer: Null;
    isDispatch: Boolean;
    asDispatch: Vec<u8>;
}
export declare interface IGearPages {
    [key: string]: Uint8Array;
}
export declare interface IProgram extends Map {
    static_pages: u32;
    persistent_pages: u32[];
    code_hash: Uint8Array;
    nonce: u64;
}
