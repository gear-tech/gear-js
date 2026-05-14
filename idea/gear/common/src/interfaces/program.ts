import type { ProgramStatus } from '../enums/index.js';
import type { IBaseDBRecord } from './common.js';

export interface IProgram extends IBaseDBRecord<number | Date> {
  id: string;
  owner: string;
  name?: string;
  metahash?: string;
  status: ProgramStatus;
  codeId: string;
}
