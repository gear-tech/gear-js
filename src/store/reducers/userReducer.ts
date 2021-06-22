import { UserState, UserAction, UserActionTypes } from '../../types/user';

const initialState: UserState = {
  user: {},
  generatedKeypair: {},
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
    
    case UserActionTypes.FETCH_USER_KEYPAIR:
      return { ...state, loading: true, error: null };

    case UserActionTypes.FETCH_USER_KEYPAIR_SUCCESS:
      return { ...state, loading: false, error: null, generatedKeypair: action.payload };

    case UserActionTypes.FETCH_USER_KEYPAIR_ERROR:
      return { ...state, loading: false, error: action.payload, generatedKeypair: {} };
    
    case UserActionTypes.RESET_USER:
      return { ...initialState };

    default:
      return state;
  }
};

export default userReducer;
