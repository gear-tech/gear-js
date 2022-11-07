import { IProgram } from 'entities/program';

type FetchProgramsParams = {
  owner?: string | null;
  limit?: number;
  offset?: number;
  query?: string;
};

type ProgramPaginationModel = {
  count: number;
  programs: IProgram[];
};

export type { FetchProgramsParams, ProgramPaginationModel };
