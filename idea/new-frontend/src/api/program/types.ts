import { ProgramModel } from 'entities/program';

type FetchUserProgramsParams = {
  owner: string | null;
  limit?: number;
  offset?: number;
  query?: string;
};

type ProgramPaginationModel = {
  count: number;
  programs: ProgramModel[];
};

export type { FetchUserProgramsParams, ProgramPaginationModel };
