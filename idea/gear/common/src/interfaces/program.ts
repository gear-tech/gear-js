import { IBaseDBRecord } from './common';
import { ProgramStatus } from '../enums';

export interface IProgram extends IBaseDBRecord<number | Date> {
  id: string;
  owner: string;
  name?: string;
  metahash?: string;
  status: ProgramStatus;
  codeId: string;
}
