import { UserState, AccountAction, AccountActionTypes } from '../../types/account';

const initialState: UserState = {
  account: null,
};

const AccountReducer = (state = initialState, action: AccountAction): UserState => {
  switch (action.type) {
    case AccountActionTypes.SET_ACCOUNT:
      console.log(action.payload);
      return { ...state, account: action.payload };

    case AccountActionTypes.RESET_ACCOUNT:
      return { ...state, account: null };

    default:
      return state;
  }
};

export default AccountReducer;
