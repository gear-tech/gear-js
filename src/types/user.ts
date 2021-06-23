export interface UserState {
    user: {};
    generatedKeypair: {};
    loading: boolean,
    error: null|string;
}

export interface UserKeypairModel {
    mnemonic: string;
    name?: string;
    public: string;
}

export enum UserActionTypes{
    FETCH_USER = 'FETCH_USER',
    FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS',
    FETCH_USER_ERROR = 'FETCH_USER_ERROR',
    FETCH_USER_KEYPAIR = 'FETCH_KEYPAIR',
    FETCH_USER_KEYPAIR_SUCCESS = 'FETCH_USER_KEYPAIR_SUCCESS',
    FETCH_USER_KEYPAIR_ERROR = 'FETCH_USER_KEYPAIR_ERROR',
    RESET_USER = 'RESET_USER'
}

interface FetchUserAction{
    type: UserActionTypes.FETCH_USER;
}
interface FetchUserSuccessAction{
    type: UserActionTypes.FETCH_USER_SUCCESS;
    payload: {};
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
    payload: {};
}
interface FetchUserKeypairErrorAction{
    type: UserActionTypes.FETCH_USER_KEYPAIR_ERROR;
    payload: string;
}

interface ResetUserAction{
    type: UserActionTypes.RESET_USER
}

export type UserAction = FetchUserAction | FetchUserErrorAction | FetchUserSuccessAction | FetchUserKeypairAction | FetchUserKeypairSuccessAction | FetchUserKeypairErrorAction | ResetUserAction;