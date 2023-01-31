import { HexString } from '@polkadot/util/types';

export type BalanceMain = {
  admin: HexString;
  ftLogicId: HexString;
  transactions: [];
};
export type BalanceLogic = {
  admin: HexString;
  ftLogicId: HexString;
  transactions: [];
  ftokenId: HexString;
  idToStorage: Array<[string, HexString]>;
  instructions: [];
  storageCodeHash: HexString;
  transactionStatus: [];
};
export type BalanceStorage = {
  approvals: [];
  balances: Array<[HexString, number]>;
  ftLogicId: HexString;
  transactionStatus: [];
};
