import UserRequestService from 'services/UserRequestService';

import { UserActionTypes } from 'types/user';
import { ProgramActionTypes } from 'types/program';
import GitRequestService from 'services/GitRequestService';
import TelegramRequestService from 'services/TelegramRequestService';
import ProgramRequestService from 'services/ProgramsRequestService';

import { GEAR_BALANCE_TRANSFER_VALUE, GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY } from 'consts';

const fetchUserAction = () => ({type: UserActionTypes.FETCH_USER});
const fetchUserSuccessAction = (payload: {}) => ({type: UserActionTypes.FETCH_USER_SUCCESS, payload});
const fetchUserErrorAction = () => ({type: UserActionTypes.FETCH_USER_ERROR});

const fetchUserKeypairAction = () => ({type: UserActionTypes.FETCH_USER_KEYPAIR});
const fetchUserKeypairSuccessAction = (payload: {}) => ({type: UserActionTypes.FETCH_USER_KEYPAIR_SUCCESS, payload});
const fetchUserKeypairErrorAction = () => ({type: UserActionTypes.FETCH_USER_KEYPAIR_ERROR});

const fetchProgramsAction = () => ({type: ProgramActionTypes.FETCH_PROGRAMS});
const fetchProgramsSuccessAction = (payload: {}) => ({type: ProgramActionTypes.FETCH_PROGRAMS_SUCCESS, payload});
const fetchProgramsErrorAction = () => ({type: ProgramActionTypes.FETCH_PROGRAMS_ERROR});

const fetchProgramAction = () => ({type: ProgramActionTypes.FETCH_PROGRAM});
const fetchProgramSuccessAction = (payload: {}) => ({type: ProgramActionTypes.FETCH_PROGRAM_SUCCESS, payload});
const fetchProgramErrorAction = () => ({type: ProgramActionTypes.FETCH_PROGRAM_ERROR});

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
    .then((value: any) => {
      window.localStorage.setItem(GEAR_MNEMONIC_KEY, value.mnemonic);
      dispatch(fetchUserKeypairSuccessAction(value));
      if (value.mnemonic) {
        userService.balanceTransfer(GEAR_BALANCE_TRANSFER_VALUE)
      }
    })
    .catch(() => dispatch(fetchUserKeypairErrorAction()));
}

export const getGitUserJwtAction = (code: string) => (dispatch: any)  => {
  dispatch(fetchUserAction());
  gitService
    .authWithGit(code)
    .then((result: any) => {
      window.localStorage.setItem(GEAR_STORAGE_KEY, result.access_token);
      dispatch(fetchUserSuccessAction(result));
    })
    .catch(() => dispatch(fetchUserErrorAction()));
};

export const getTelegramUserJwtAction = (user: any) => (dispatch: any) => {
  dispatch(fetchUserAction());
  telegramService
    .authWithTelegram(user)
    .then((result: {}) => {
      dispatch(fetchUserSuccessAction(result));
    })
    .catch(() => dispatch(fetchUserErrorAction()));
}

export const getProgramsAction = () => (dispatch: any) => {
  dispatch(fetchProgramsAction());
  programService
    .fetchAllPrograms()
    .then((value: {}) => {
      console.log(value)
      dispatch(fetchProgramsSuccessAction(value));
    })
    .catch(() => dispatch(fetchProgramsErrorAction()))
}

export const getProgramAction = (hash: string) => (dispatch: any) => {
  dispatch(fetchProgramAction());
  programService
    .fetchProgram(hash)
    .then((value: {}) => {
      dispatch(fetchProgramSuccessAction(value));
    })
    .catch(() => dispatch(fetchProgramErrorAction()))
}

export const logoutFromAccountAction = () => (dispatch: any) => {
  localStorage.clear();
  dispatch(resetUserAction());
  dispatch(resetProgramsAction());
}