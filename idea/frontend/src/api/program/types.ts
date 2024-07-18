import { HexString } from '@gear-js/api';

import { ProgramStatus } from '@/features/program';

type FetchProgramsParams = {
  owner?: string | null;
  limit?: number;
  offset?: number;
  query?: string;
  status?: ProgramStatus[];
  codeId?: HexString;
};

export type { FetchProgramsParams };
