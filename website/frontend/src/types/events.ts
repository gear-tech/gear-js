export enum EventTypes {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface AlertModel {
  type: EventTypes;
  message: string;
}
