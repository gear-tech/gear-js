import type { ProgramStatus } from '../enums';
import type { IBaseDBRecord } from './common';

export interface IProgram extends IBaseDBRecord<number | Date> {
  id: string;
  owner: string;
  name?: string;
  metahash?: string;
  status: ProgramStatus;
  codeId: string;
}
