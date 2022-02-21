import { AlertState, AlertAction, AlertActionTypes } from 'types/alerts';

const initialState: AlertState = {
  alert: null,
};

const AlertReducer = (state = initialState, action: AlertAction) => {
  switch (action.type) {
    case AlertActionTypes.ADD_ALERT:
      return { ...state, alert: action.payload };

    default:
      return state;
  }
};

export default AlertReducer;
