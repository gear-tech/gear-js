export enum EventTypes {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface AlertModel {
  type: EventTypes;
  message: string;
}

export interface AlertState {
  alert: AlertModel | null;
}

export enum AlertActionTypes {
  ADD_ALERT = 'ADD_ALERT',
  DELETE_ALERT = 'DELETE_ALERT',
}

interface AddAlertAction {
  type: AlertActionTypes.ADD_ALERT;
  payload: AlertModel;
}

interface DeleteAlertAction {
  type: AlertActionTypes.DELETE_ALERT;
}

export type AlertAction = AddAlertAction | DeleteAlertAction;
