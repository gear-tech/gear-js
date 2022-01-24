import { AlertState, AlertAction, AlertActionTypes } from 'types/alerts';

const initialState: AlertState = {
  alert: null,
};

const AlertReducer = (state = initialState, action: AlertAction) => {
  switch (action.type) {
    case AlertActionTypes.ADD_ALERT:
      return { ...state, alert: action.payload };

    case AlertActionTypes.ADD_ALERT:
      return { ...state, alert: null };

    default:
      return state;
  }
};

export default AlertReducer;
