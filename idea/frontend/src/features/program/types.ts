import { HexString } from '@polkadot/util/types';

import { ICode } from 'entities/code';
import { IBase } from 'shared/types';
import { OwnerFilter } from 'api/consts';

import { ProgramStatus } from './consts';

interface IProgram extends IBase {
  id: HexString;
  owner: string;
  name: string;
  status: ProgramStatus;
  metahash: HexString | null;
  hasState: boolean;
  expiration?: number;
  code?: ICode;
}

type FiltersValues = {
  owner: OwnerFilter;
  status: ProgramStatus[];
};

type RequestParams = {
  owner?: string;
  status?: ProgramStatus[];
  query?: string;
};

export type { IProgram, FiltersValues, RequestParams };
