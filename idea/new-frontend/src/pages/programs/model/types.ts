import { Sort } from 'features/sortBy';
import { ProgramStatus } from 'entities/program';

enum Owner {
  All = 'all',
  User = 'user',
}

type FiltersValues = {
  owner: Owner;
  status: ProgramStatus[];
  createAt: string;
};

type RequestParams = {
  owner?: string;
  status?: ProgramStatus[];
  query?: string;
  sortBy?: Sort;
  createAt?: string;
};

export { Owner };
export type { FiltersValues, RequestParams };
