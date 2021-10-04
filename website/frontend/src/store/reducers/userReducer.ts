import { UserState, UserAction, UserActionTypes } from '../../types/user';

const initialState: UserState = {
  user: null,
  accessToken: '',
  generatedKeypair: null,
  isBalanceTransfered: false,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionTypes.FETCH_TOKEN:
      return { ...state, loading: true, error: null };

    case UserActionTypes.FETCH_TOKEN_SUCCESS:
      return { ...state, loading: false, error: null, accessToken: action.payload };

    case UserActionTypes.FETCH_TOKEN_ERROR:
      return { ...state, loading: false, error: action.payload, accessToken: '' };

    case UserActionTypes.FETCH_USER:
      return { ...state, loading: true, error: null };

    case UserActionTypes.FETCH_USER_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload };

    case UserActionTypes.FETCH_USER_ERROR:
      return { ...state, loading: false, error: action.payload, user: null };

    case UserActionTypes.FETCH_USER_KEYPAIR:
      return { ...state, loading: true, error: null };

    case UserActionTypes.FETCH_USER_KEYPAIR_SUCCESS:
      return { ...state, loading: false, error: null, generatedKeypair: action.payload };

    case UserActionTypes.FETCH_USER_KEYPAIR_ERROR:
      return { ...state, loading: false, error: action.payload, generatedKeypair: null };

    case UserActionTypes.TRANSFER_BALANCE:
      return { ...state, isBalanceTransfered: true };

    case UserActionTypes.RESET_USER:
      return { ...initialState };

    default:
      return state;
  }
};

export default userReducer;
