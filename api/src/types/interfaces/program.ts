import { Vec, Bytes, u8, u32, u64, Null, Map, Type, BTreeSet } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';

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

export declare interface IProgram extends Type {
  isActive: boolean;
  asActive: IActiveProgram;
  isTerminated: boolean;
  asTerminated: null;
}

export declare interface IActiveProgram extends Map {
  allocations: BTreeSet<u32>;
  pages_with_data: BTreeSet<u32>;
  code_hash: Uint8Array;
  nonce: u64;
  state: IProgramState;
}

export declare interface IProgramState {
  isUninitialized: boolean;
  asUninitialized: { messageId: H256 };
  isInitialized: boolean;
  asInitialized: null;
}
