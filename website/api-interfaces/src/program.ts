import { Meta } from '.';

export enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

export interface Program {
  id: string;
  chain: string;
  owner: string;
  uploadedAt: Date;
  name?: string;
  meta?: Meta;
  title?: string;
  initStatus: InitStatus;
}

export interface GetAllProgramsParams {
  chain: string;
  publicKeyRaw?: string;
  owner?: string;
  limit?: number;
  offset?: number;
}

export interface GetAllProgramsResult {
  programs: Program[];
  count: number;
}

export interface FindProgramParams {
  id: string;
  chain: string;
  owner?: string;
}
