import { OwnerFilter } from '@/api/consts';

import { RequestParams, FiltersValues } from './types';

const DEFAULT_FILTER_VALUES: FiltersValues = {
  owner: OwnerFilter.All,
  isRerender: false, // TODO: get rid of monkey patch
};

const DEFAULT_REQUEST_PARAMS: RequestParams = {
  query: '',
};

export { OwnerFilter, DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES };
