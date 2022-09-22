import { OwnerFilter } from 'api/consts';
import { Sort } from 'features/sortBy';

type FiltersValues = {
  createAt: string;
  destination: OwnerFilter;
};

type RequestParams = {
  query?: string;
  sortBy?: Sort;
  createAt?: string;
  destination?: string;
};

export type { FiltersValues, RequestParams };
