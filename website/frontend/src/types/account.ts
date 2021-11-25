import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export interface UserAccount extends InjectedAccountWithMeta {
  isActive?: boolean;
}

export interface UserState {
  account: null | UserAccount;
}

export enum AccountActionTypes {
  SET_ACCOUNT = 'SET_ACCOUNT',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
}

interface SetAccountAction {
  type: AccountActionTypes.SET_ACCOUNT;
  payload: UserAccount;
}

interface ResetAccountAction {
  type: AccountActionTypes.RESET_ACCOUNT;
}

export type AccountAction = SetAccountAction | ResetAccountAction;
