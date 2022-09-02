// import { Sort } from 'features/sortBy';

import { RequestParams, FiltersValues } from './types';

const FILTERS_INITIAL_VALUES: FiltersValues = {
  owner: '',
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

export { FILTERS_INITIAL_VALUES, DEFAULT_REQUEST_PARAMS };
