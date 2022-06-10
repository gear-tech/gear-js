import { IMeta } from './meta';
import { IBaseDBRecord } from './common';

enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

interface IProgram extends IBaseDBRecord<number | Date> {
  id: string;
  owner: string;
  name?: string;
  meta?: IMeta;
  title?: string;
  initStatus: InitStatus;
}

interface IProgramChangedData {
  id: string;
  isActive: boolean;
}

export { InitStatus, IProgram, IProgramChangedData };
