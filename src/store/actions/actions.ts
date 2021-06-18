import { UserActionTypes } from '../../types/user';
import GitRequestService from '../../services/GitRequestService';

const fetchUserAction = () => ({type: UserActionTypes.FETCH_USER});
const fetchUserSuccessAction = (payload: {}) => ({type: UserActionTypes.FETCH_USER_SUCCESS, payload});
const fetchUserErrorAction = () => ({type: UserActionTypes.FETCH_USER_ERROR});

const gitService = new GitRequestService();

const getGitUserJwtAction = (code: string) => (dispatch: any)  => {
  dispatch(fetchUserAction());
  console.log('get git jwt action', code);
  gitService
    .authWithGit(code)
    .then((result: {}) => {
      console.log(result);
      dispatch(fetchUserSuccessAction(result));
    })
    .catch(() => dispatch(fetchUserErrorAction()));
};

export default getGitUserJwtAction;