import { HexString } from '@polkadot/util/types';

import { IBase } from '@/shared/types';
import { OwnerFilter } from '@/api/consts';

import { ProgramStatus } from './consts';

type Program = {
  id: HexString;
  owner: string;
  name: string;
  status: ProgramStatus;
  metahash: HexString | null;
  hasState: boolean;
  expiration?: number;
  code?: { id: HexString };
};

type IProgram = Program & IBase;

type FiltersValues = {
  owner: OwnerFilter;
  status: ProgramStatus[];
};

type RequestParams = {
  owner?: string;
  status?: ProgramStatus[];
  query?: string;
};

export type { Program, IProgram, FiltersValues, RequestParams };
