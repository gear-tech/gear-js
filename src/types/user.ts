export interface UserState {
    user: UserModel | null;
    accessToken: string;
    generatedKeypair: UserKeypairModel | null;
    isBalanceTransfered: boolean;
    loading: boolean;
    error: null|string;
}

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

export interface UserProfileInterface {
    jsonrpc: string,
    id: string,
    result: UserModel
}
  
export interface UserKeypairInterface {
    jsonrpc: string,
    id: string,
    result: UserKeypairModel
}

export enum UserActionTypes{
    FETCH_TOKEN = 'FETCH_TOKEN',
    FETCH_TOKEN_SUCCESS = 'FETCH_TOKEN_SUCCESS',
    FETCH_TOKEN_ERROR = 'FETCH_TOKEN_ERROR',
    FETCH_USER = 'FETCH_USER',
    FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS',
    FETCH_USER_ERROR = 'FETCH_USER_ERROR',
    FETCH_USER_KEYPAIR = 'FETCH_KEYPAIR',
    FETCH_USER_KEYPAIR_SUCCESS = 'FETCH_USER_KEYPAIR_SUCCESS',
    FETCH_USER_KEYPAIR_ERROR = 'FETCH_USER_KEYPAIR_ERROR',
    TRANSFER_BALANCE_SUCCESS = 'TRANSFER_BALANCE_SUCCESS',
    RESET_USER = 'RESET_USER'
}

interface FetchTokenAction{
    type: UserActionTypes.FETCH_TOKEN;
}
interface FetchTokenSuccessAction{
    type: UserActionTypes.FETCH_TOKEN_SUCCESS;
    payload: string;
}
interface FetchTokenErrorAction{
    type: UserActionTypes.FETCH_TOKEN_ERROR;
    payload: string;
}

interface FetchUserAction{
    type: UserActionTypes.FETCH_USER;
}
interface FetchUserSuccessAction{
    type: UserActionTypes.FETCH_USER_SUCCESS;
    payload: UserModel;
}
interface FetchUserErrorAction{
    type: UserActionTypes.FETCH_USER_ERROR;
    payload: string;
}

interface FetchUserKeypairAction{
    type: UserActionTypes.FETCH_USER_KEYPAIR;
}
interface FetchUserKeypairSuccessAction{
    type: UserActionTypes.FETCH_USER_KEYPAIR_SUCCESS;
    payload: UserKeypairModel;
}
interface FetchUserKeypairErrorAction{
    type: UserActionTypes.FETCH_USER_KEYPAIR_ERROR;
    payload: string;
}

interface TransferBalanceAction {
    type: UserActionTypes.TRANSFER_BALANCE_SUCCESS;
}

interface ResetUserAction{
    type: UserActionTypes.RESET_USER
}

export type UserAction = FetchTokenAction | FetchTokenSuccessAction | FetchTokenErrorAction |  FetchUserAction | FetchUserErrorAction | FetchUserSuccessAction | FetchUserKeypairAction | FetchUserKeypairSuccessAction | FetchUserKeypairErrorAction | TransferBalanceAction | ResetUserAction;