import { Program } from './entities/program.entity';

export interface GetAllProgramsParams {
  chain: string;
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
