import { IMeta } from './meta';
import { IBaseDBRecord } from './common';
import { InitStatus } from '../enums';

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

export { IProgram, IProgramChangedData };
