import { UserState, UserAction, UserActionTypes } from '../../types/user';

const initialState: UserState = {
  user: {},
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionTypes.FETCH_USER:
      return { ...state, loading: true, error: null };

    case UserActionTypes.FETCH_USER_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload };

    case UserActionTypes.FETCH_USER_ERROR:
      return { ...state, loading: false, error: action.payload, user: {} };

    default:
      return state;
  }
};

export default userReducer;
