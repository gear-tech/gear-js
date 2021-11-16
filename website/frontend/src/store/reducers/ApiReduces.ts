import { ApiState, ApiActionTypes, ApiAction } from '../../types/api';

const initialState: ApiState = {
  isApiReady: false,
};

const ApiReducer = (state = initialState, action: ApiAction): ApiState => {
  switch (action.type) {
    case ApiActionTypes.SET_API:
      return { ...state, isApiReady: true };

    case ApiActionTypes.RESET_API:
      return { ...state, isApiReady: false };

    default:
      return state;
  }
};

export default ApiReducer;
