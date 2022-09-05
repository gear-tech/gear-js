// import { Sort } from 'features/sortBy';

import { RequestParams, FiltersValues, Owner } from './types';

const DEFAULT_FILTER_VALUES: FiltersValues = {
  owner: Owner.All,
  status: [],
  createAt: '',
};

const DEFAULT_REQUEST_PARAMS: RequestParams = {
  query: '',
  // owner: '',
  // sortBy: Sort.Last,
  // status: [],
  // createAt: '',
};

export { Owner, DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES };
