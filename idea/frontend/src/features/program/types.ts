import { HexString } from '@polkadot/util/types';

import { IBase } from '@/shared/types';
import { OwnerFilter } from '@/api/consts';

import { ProgramStatus } from './consts';

type Program = {
  id: HexString;
  owner: HexString;
  name: string;
  status: ProgramStatus;
  codeId: HexString;
  metahash: HexString | null;
  hasState: boolean;
};

type IProgram = Program & IBase;

type FiltersValues = {
  owner: OwnerFilter;
  status: ProgramStatus[];
};

export type { Program, IProgram, FiltersValues };
