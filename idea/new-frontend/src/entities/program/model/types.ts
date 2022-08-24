import { ProgramStatus } from './consts';

type ProgramModel = {
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
};

export type { ProgramModel };
