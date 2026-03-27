import { IBaseDBRecord } from './common.js';
import { ProgramStatus } from '../enums/index.js';

export interface IProgram extends IBaseDBRecord<number | Date> {
  id: string;
  owner: string;
  name?: string;
  metahash?: string;
  status: ProgramStatus;
  codeId: string;
}
