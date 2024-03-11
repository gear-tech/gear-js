import { HexString } from '@gear-js/api';

import { LocalProgram } from '@/features/local-indexer';
import { IProgram, ProgramStatus } from '@/features/program';

type FetchProgramsParams = {
  owner?: string | null;
  limit?: number;
  offset?: number;
  query?: string;
  status?: ProgramStatus[];
  codeId?: HexString;
};

type ProgramPaginationModel = {
  count: number;
  programs: (IProgram | LocalProgram)[];
};

export type { FetchProgramsParams, ProgramPaginationModel };
