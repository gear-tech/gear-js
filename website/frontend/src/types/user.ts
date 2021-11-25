export interface UserModel {
  email: string | null;
  name: string;
  username: string;
  photoUrl: string;
  publicKey: string;
}

export interface UserKeypairModel {
  mnemonic: string;
  name?: string;
  public: string;
}

export interface UserState {
  user: UserModel | null;
  generatedKeypair: UserKeypairModel | null;
  isBalanceTransfered: boolean;
  loading: boolean;
  error: null | string;
}

export interface UserProfileRPCModel {
  jsonrpc: string;
  id: string;
  result: UserModel;
}

export interface UserKeypairRPCModel {
  jsonrpc: string;
  id: string;
  result: UserKeypairModel;
}

export enum UserActionTypes {
  FETCH_USER = 'FETCH_USER',
  FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS',
  FETCH_USER_ERROR = 'FETCH_USER_ERROR',
  FETCH_USER_KEYPAIR = 'FETCH_KEYPAIR',
  FETCH_USER_KEYPAIR_SUCCESS = 'FETCH_USER_KEYPAIR_SUCCESS',
  FETCH_USER_KEYPAIR_ERROR = 'FETCH_USER_KEYPAIR_ERROR',
  TRANSFER_BALANCE = 'TRANSFER_BALANCE',
}

interface FetchUserAction {
  type: UserActionTypes.FETCH_USER;
}
interface FetchUserSuccessAction {
  type: UserActionTypes.FETCH_USER_SUCCESS;
  payload: UserModel;
}
interface FetchUserErrorAction {
  type: UserActionTypes.FETCH_USER_ERROR;
  payload: string;
}

interface FetchUserKeypairAction {
  type: UserActionTypes.FETCH_USER_KEYPAIR;
}
interface FetchUserKeypairSuccessAction {
  type: UserActionTypes.FETCH_USER_KEYPAIR_SUCCESS;
  payload: UserKeypairModel;
}
interface FetchUserKeypairErrorAction {
  type: UserActionTypes.FETCH_USER_KEYPAIR_ERROR;
  payload: string;
}

interface TransferBalanceAction {
  type: UserActionTypes.TRANSFER_BALANCE;
}

export type UserAction =
  | FetchUserAction
  | FetchUserErrorAction
  | FetchUserSuccessAction
  | FetchUserKeypairAction
  | FetchUserKeypairSuccessAction
  | FetchUserKeypairErrorAction
  | TransferBalanceAction;
