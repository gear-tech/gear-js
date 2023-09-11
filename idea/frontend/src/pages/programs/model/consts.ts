import { OwnerFilter } from 'api/consts';
import { ProgramStatus } from 'features/program';

const DEFAULT_FILTER_VALUES = {
  owner: OwnerFilter.All,
  status: [] as ProgramStatus[],
};

const DEFAULT_REQUEST_PARAMS = {
  query: '',
};

export { DEFAULT_REQUEST_PARAMS, DEFAULT_FILTER_VALUES };
