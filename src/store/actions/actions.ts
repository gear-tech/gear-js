import { UserActionTypes } from '../../types/user';
import GitRequestService from '../../services/GitRequestService';

import { GEAR_STORAGE_KEY } from '../../consts';

const fetchUserAction = () => ({type: UserActionTypes.FETCH_USER});
const fetchUserSuccessAction = (payload: {}) => ({type: UserActionTypes.FETCH_USER_SUCCESS, payload});
const fetchUserErrorAction = () => ({type: UserActionTypes.FETCH_USER_ERROR});
const resetUserAction = () => ({type: UserActionTypes.RESET_USER});

const gitService = new GitRequestService();

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
  gitService
    .authWithTelegram(user)
    .then((result: {}) => {
      dispatch(fetchUserSuccessAction(result));
    })
    .catch(() => dispatch(fetchUserErrorAction()));
}

export const logoutFromAccountAction = () => (dispatch: any) => {
  localStorage.clear();
  dispatch(resetUserAction());
}
