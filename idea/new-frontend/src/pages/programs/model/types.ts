import { OwnerFilter } from 'api/consts';
import { ProgramStatus } from 'entities/program';

type FiltersValues = {
  owner: OwnerFilter;
  status: ProgramStatus[];
};

type RequestParams = {
  owner?: string;
  status?: ProgramStatus[];
  query?: string;
};

export type { FiltersValues, RequestParams };
