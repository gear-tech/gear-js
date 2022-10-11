import { IMeta } from './meta';
import { IBaseDBRecord } from './common';
import { ProgramStatus } from '../enums';

interface IProgram extends IBaseDBRecord<number | Date> {
  _id: string;
  id: string;
  owner: string;
  name?: string;
  meta?: IMeta;
  title?: string;
  status: ProgramStatus;
}

interface IProgramChangedData {
  id: string;
  isActive: boolean;
}

export { IProgram, IProgramChangedData };
