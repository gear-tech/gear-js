export interface ApiState {
  isApiReady: boolean;
}

export enum ApiActionTypes {
  SET_API = 'SET_API',
  RESET_API = 'RESET_API',
}

interface SetApiAction {
  type: ApiActionTypes.SET_API;
}

interface ResetApiAction {
  type: ApiActionTypes.RESET_API;
}

export type ApiAction = SetApiAction | ResetApiAction;
