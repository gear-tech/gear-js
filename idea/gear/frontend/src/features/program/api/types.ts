import type { HexString } from '@gear-js/api';

import type { PaginationParameters } from '@/api';
import type { IBase } from '@/shared/types';

import type { ProgramStatus } from '../consts';

type ProgramsParameters = PaginationParameters & {
  owner?: string;
  name?: string;
  codeId?: string;
  status?: ProgramStatus[];
  query?: string;
};

type SetProgramMetaParameters = {
  id: HexString;
  name?: string;
  metaType?: 'sails' | 'meta';
};

type Program = IBase & {
  id: HexString;
  status: ProgramStatus;
  codeId: HexString;
  owner: HexString | null;
  name: string | null;
  expiration: string | null;
  metahash: HexString | null;
  metaType?: 'sails' | 'meta' | null;
};

export type { Program, ProgramsParameters, SetProgramMetaParameters };
