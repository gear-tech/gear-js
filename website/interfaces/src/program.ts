import { IMeta } from './meta';
import { IBaseDBRecord } from './general';

export enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

export interface IProgram extends IBaseDBRecord<number | Date> {
  id: string;
  owner: string;
  name?: string;
  meta?: IMeta;
  title?: string;
  initStatus: InitStatus;
}
