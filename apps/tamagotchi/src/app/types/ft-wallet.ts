import { Hex } from '@gear-js/api';

export type BalanceMain = {
  admin: Hex;
  ftLogicId: Hex;
  transactions: [];
};
export type BalanceLogic = {
  admin: Hex;
  ftLogicId: Hex;
  transactions: [];
  ftokenId: Hex;
  idToStorage: Array<[string, Hex]>;
  instructions: [];
  storageCodeHash: Hex;
  transactionStatus: [];
};
export type BalanceStorage = {
  approvals: [];
  balances: Array<[Hex, number]>;
  ftLogicId: Hex;
  transactionStatus: [];
};
