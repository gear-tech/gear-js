import { AlertModel } from '../../types/events';

export enum AlertActionTypes {
  ADD_ALERT = 'ADD_ALERT',
}

interface AddAlertAction {
  type: AlertActionTypes.ADD_ALERT;
  payload: AlertModel;
}

export type AlertAction = AddAlertAction;

interface AlertState {
  alert: null | AlertModel;
}

const defaultState: AlertState = {
  alert: null,
};

const AlertReducer = (state = defaultState, action: AlertAction) => {
  switch (action.type) {
    case AlertActionTypes.ADD_ALERT:
      return { ...state, alert: action.payload };
    default:
      return state;
  }
};

export default AlertReducer;
