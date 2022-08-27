import { ProgramStatus } from './consts';

interface IProgram {
  id: string;
  blockHash?: string;
  programNumber?: number;
  name?: string;
  owner: string;
  callCount?: number;
  timestamp: string;
  initStatus: ProgramStatus;
  title?: string;
  meta: {
    meta: string;
  } | null;
}

export type { IProgram };
