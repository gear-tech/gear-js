import { Sort } from 'features/sortBy';
import { ProgramStatus } from 'entities/program';

type FiltersValues = {
  owner: string;
  status: ProgramStatus[];
  createAt: string;
};

type RequestParams = Partial<FiltersValues> & {
  query?: string;
  sortBy?: Sort;
};

export type { FiltersValues, RequestParams };
