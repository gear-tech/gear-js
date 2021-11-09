import { Vec, Bytes, u8, Null } from '@polkadot/types';
export declare interface Reason extends Bytes {
  isError: Boolean;
  asError: Null;
  isValueTransfer: Boolean;
  asValueTransfer: Null;
  isDispatch: Boolean;
  asDispatch: Vec<u8>;
}
