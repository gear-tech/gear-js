import { OwnerFilter } from 'api/consts';
import { Sort } from 'features/sortBy';
import { Type } from 'entities/message';

type FiltersValues = {
  createAt: string;
  location: Type[];
  destination: OwnerFilter;
};

type RequestParams = {
  query?: string;
  sortBy?: Sort;
  location?: Type[];
  createAt?: string;
  destination?: string;
};

export type { FiltersValues, RequestParams };
