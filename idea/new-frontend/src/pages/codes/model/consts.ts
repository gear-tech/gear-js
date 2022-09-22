import { OwnerFilter } from 'api/consts';
// import { Sort } from 'features/sortBy';

import { RequestParams, FiltersValues } from './types';

const DEFAULT_FILTER_VALUES: FiltersValues = {
  createAt: '',
  destination: OwnerFilter.All,
};

const DEFAULT_REQUEST_PARAMS: RequestParams = {
  query: '',
  // owner: '',
  // sortBy: Sort.Last,
  // status: [],
  // createAt: '',
};

export { OwnerFilter, DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES };
