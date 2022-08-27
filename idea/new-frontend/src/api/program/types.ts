import { IProgram } from 'entities/program';

type FetchUserProgramsParams = {
  owner: string | null;
  limit?: number;
  offset?: number;
  query?: string;
};

type ProgramPaginationModel = {
  count: number;
  programs: IProgram[];
};

export type { FetchUserProgramsParams, ProgramPaginationModel };
