import { OwnerFilter } from 'api/consts';

import { RequestParams, FiltersValues } from './types';

const DEFAULT_FILTER_VALUES: FiltersValues = {
  owner: OwnerFilter.All,
  status: [],
};

const DEFAULT_REQUEST_PARAMS: RequestParams = {
  query: '',
};

export { DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES };
