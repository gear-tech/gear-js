import UserRequestService from 'services/UserRequestService';

import { UserActionTypes, UserKeypairModel, UserKeypairInterface, UserModel, UserProfileInterface } from 'types/user';
import { ProgramActionTypes, ProgramModel, ProgramsInterface, ProgramInterface } from 'types/program';
import GitRequestService from 'services/GitRequestService';
import TelegramRequestService from 'services/TelegramRequestService';
import ProgramRequestService from 'services/ProgramsRequestService';

import { GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY } from 'consts';
import { BlockActionTypes } from 'types/block';

const fetchTokenAction = () => ({type: UserActionTypes.FETCH_TOKEN});
const fetchTokenSuccessAction = (payload: {}) => ({type: UserActionTypes.FETCH_TOKEN_SUCCESS, payload});
const fetchTokenErrorAction = () => ({type: UserActionTypes.FETCH_TOKEN_ERROR});

const fetchUserAction = () => ({type: UserActionTypes.FETCH_USER});
const fetchUserSuccessAction = (payload: UserModel) => ({type: UserActionTypes.FETCH_USER_SUCCESS, payload});
const fetchUserErrorAction = () => ({type: UserActionTypes.FETCH_USER_ERROR});

const fetchUserKeypairAction = () => ({type: UserActionTypes.FETCH_USER_KEYPAIR});
const fetchUserKeypairSuccessAction = (payload: UserKeypairModel) => ({type: UserActionTypes.FETCH_USER_KEYPAIR_SUCCESS, payload});
const fetchUserKeypairErrorAction = () => ({type: UserActionTypes.FETCH_USER_KEYPAIR_ERROR});

export const transferBalanceSuccessAction = () => ({type: UserActionTypes.TRANSFER_BALANCE_SUCCESS});

const fetchProgramsAction = () => ({type: ProgramActionTypes.FETCH_PROGRAMS});
const fetchProgramsSuccessAction = (payload: ProgramModel[]) => ({type: ProgramActionTypes.FETCH_PROGRAMS_SUCCESS, payload});
const fetchProgramsErrorAction = () => ({type: ProgramActionTypes.FETCH_PROGRAMS_ERROR});

const fetchProgramAction = () => ({type: ProgramActionTypes.FETCH_PROGRAM});
const fetchProgramSuccessAction = (payload: ProgramModel) => ({type: ProgramActionTypes.FETCH_PROGRAM_SUCCESS, payload});
const fetchProgramErrorAction = () => ({type: ProgramActionTypes.FETCH_PROGRAM_ERROR});

export const fetchTotalIssuanceAction = (payload: {}) => ({type: BlockActionTypes.FETCH_TOTALISSUANCE_SUCCESS, payload});
export const fetchBlockAction = (payload: {}) => ({type: BlockActionTypes.FETCH_BLOCK_SUCCESS, payload});
export const programUploadStartAction = () => ({type: ProgramActionTypes.PROGRAM_UPLOAD_START});
export const programUploadSuccessAction = () => ({type: ProgramActionTypes.PROGRAM_UPLOAD_SUCCESS});
export const programUploadFailedAction = (payload: string) => ({type: ProgramActionTypes.PROGRAM_UPLOAD_FAILED, payload});
export const programUploadInBlockAction = () => ({type: ProgramActionTypes.PROGRAM_UPLOAD_IN_BLOCK});
export const programUploadFinalizedAction = () => ({type: ProgramActionTypes.PROGRAM_UPLOAD_FINALIZED});
export const programUploadProgramInitializedAction = () => ({type: ProgramActionTypes.PROGRAM_UPLOAD_INITIALIZED});

const resetUserAction = () => ({type: UserActionTypes.RESET_USER});
const resetProgramsAction = () => ({type: ProgramActionTypes.RESET_PROGRAMS});

const gitService = new GitRequestService();
const telegramService = new TelegramRequestService();
const userService = new UserRequestService();
const programService = new ProgramRequestService();

export const generateKeypairAction = () => (dispatch: any) => {
  dispatch(fetchUserKeypairAction());
  userService
    .generateKeypair()
    .then((result: UserKeypairInterface) => {
      window.localStorage.setItem(GEAR_MNEMONIC_KEY, JSON.stringify(result.result));
      dispatch(fetchUserKeypairSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchUserKeypairErrorAction()));
}

export const getGitUserJwtAction = (code: string) => (dispatch: any)  => {
  dispatch(fetchTokenAction());
  gitService
    .authWithGit(code)
    .then((result: any) => {
      window.localStorage.setItem(GEAR_STORAGE_KEY, result.result.access_token);
      dispatch(fetchTokenSuccessAction(result));
    })
    .catch(() => dispatch(fetchTokenErrorAction()));
};

export const getTelegramUserJwtAction = (user: any) => (dispatch: any) => {
  dispatch(fetchTokenAction());
  telegramService
    .authWithTelegram(user)
    .then((result: any) => {
      window.localStorage.setItem(GEAR_STORAGE_KEY, result.result.access_token);
      dispatch(fetchTokenSuccessAction(result));
      if (result.result.access_token) {
        window.location.reload();
      }
    })
    .catch(() => dispatch(fetchTokenErrorAction()));
}

export const getTestUserJwtAction = (userId: string) => (dispatch: any) => {
  dispatch(fetchTokenAction());
  userService
    .authWithTest(userId)
    .then((result: any) => {
      window.localStorage.setItem(GEAR_STORAGE_KEY, result.result.access_token);
      dispatch(fetchTokenSuccessAction(result));
      if (result.result.access_token) {
        window.location.reload();
      }
    })
    .catch(() => dispatch(fetchTokenErrorAction()));
}

export const getUserDataAction = () => (dispatch: any) => {
  dispatch(fetchUserAction());
  userService
    .fetchUserData()
    .then((result: UserProfileInterface) => {
      dispatch(fetchUserSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchUserErrorAction()));
}

export const getProgramsAction = () => (dispatch: any) => {
  dispatch(fetchProgramsAction());
  programService
    .fetchAllPrograms()
    .then((result: ProgramsInterface) => {
      dispatch(fetchProgramsSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchProgramsErrorAction()))
}

export const getProgramAction = (hash: string) => (dispatch: any) => {
  dispatch(fetchProgramAction());
  programService
    .fetchProgram(hash)
    .then((result: ProgramInterface) => {
      dispatch(fetchProgramSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchProgramErrorAction()))
}

export const logoutFromAccountAction = () => (dispatch: any) => {
  localStorage.clear();
  dispatch(resetUserAction());
  dispatch(resetProgramsAction());
}
