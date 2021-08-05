import UserRequestService from 'services/UserRequestService';

import { UserActionTypes, UserKeypairModel, UserKeypairInterface, UserModel, UserProfileInterface } from 'types/user';
import { ProgramActionTypes, ProgramModel, ProgramsInterface, ProgramInterface, MessageStatusModel, ProgramsListInterface, UploadedProgramModel} from 'types/program';
import GitRequestService from 'services/GitRequestService';
import TelegramRequestService from 'services/TelegramRequestService';
import ProgramRequestService from 'services/ProgramsRequestService';

import { GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY } from 'consts';
import { BlockActionTypes } from 'types/block';
import { routes } from 'routes';
import { PaginationParams } from 'types/common';

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
const fetchAllProgramsSuccessAction = (payload: UploadedProgramModel[]) => ({type: ProgramActionTypes.FETCH_ALL_PROGRAMS_SUCCESS, payload});
const fetchProgramsErrorAction = () => ({type: ProgramActionTypes.FETCH_PROGRAMS_ERROR});

const fetchProgramAction = () => ({type: ProgramActionTypes.FETCH_PROGRAM});
const fetchProgramSuccessAction = (payload: ProgramModel) => ({type: ProgramActionTypes.FETCH_PROGRAM_SUCCESS, payload});
const fetchProgramErrorAction = () => ({type: ProgramActionTypes.FETCH_PROGRAM_ERROR});

export const fetchTotalIssuanceAction = (payload: {}) => ({type: BlockActionTypes.FETCH_TOTALISSUANCE_SUCCESS, payload});
export const fetchBlockAction = (payload: {}) => ({type: BlockActionTypes.FETCH_BLOCK_SUCCESS, payload});

export const programUploadStartAction = () => ({type: ProgramActionTypes.PROGRAM_UPLOAD_START});
export const programUploadStatusAction = (payload: string) => ({type: ProgramActionTypes.PROGRAM_UPLOAD_STATUS, payload});
export const programUploadResetAction = () => ({type: ProgramActionTypes.PROGRAM_UPLOAD_RESET});
const programUploadSuccessAction = () => ({type: ProgramActionTypes.PROGRAM_UPLOAD_SUCCESS});
const programUploadFailedAction = (payload: string) => ({type: ProgramActionTypes.PROGRAM_UPLOAD_FAILED, payload});

export const sendMessageStartAction = () => ({type: ProgramActionTypes.SEND_MESSAGE_START});
export const sendMessageStatusAction = (payload: MessageStatusModel) => ({type: ProgramActionTypes.SEND_MESSAGE_STATUS, payload});
export const sendMessageResetAction = () => ({type: ProgramActionTypes.SEND_MESSAGE_RESET});
const sendMessageSuccessAction = () => ({type: ProgramActionTypes.SEND_MESSAGE_SUCCESS});
const sendMessageFailedAction = (payload: string) => ({type: ProgramActionTypes.SEND_MESSAGE_FAILED, payload});

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

export const getProgramsListAction = (params: PaginationParams) => (dispatch: any) => {
  dispatch(fetchProgramsAction());
  programService
    .fetchProgramsList(params)
    .then((result: ProgramsListInterface) => {
      dispatch(fetchAllProgramsSuccessAction(result.result.result));
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

export const handleProgramError = (error: string) => (dispatch: any, getState: any) => {
  const { programs } = getState();
  if (programs.isProgramUploading) {
    dispatch(programUploadFailedAction(error));
  } else if (programs.isMessageSending) {
    dispatch(sendMessageFailedAction(error));
  }
}

export const handleProgramSuccess = () => (dispatch: any, getState: any) => {
  const { programs } = getState();
  if (programs.isProgramUploading) {
    window.location.pathname = routes.uploadedPrograms
    dispatch(programUploadSuccessAction());
  } else if (programs.isMessageSending) {
    dispatch(sendMessageSuccessAction());
  }
}

export const logoutFromAccountAction = () => (dispatch: any) => {
  localStorage.clear();
  dispatch(resetUserAction());
  dispatch(resetProgramsAction());
}
