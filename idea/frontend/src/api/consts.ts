import { getNextPageParam, select } from './utils';

enum OwnerFilter {
  All = 'all',
  User = 'user',
}

// there's a problem with return type of select if those options are destructured to useInfiniteQuery,
// therefore a little bit of boilerplate is needed. need to figure it out
const INFINITE_QUERY = {
  INITIAL_PAGE_PARAM: 0,
  GET_NEXT_PAGE_PARAM: getNextPageParam,
  SELECT: select,
};

export { OwnerFilter, INFINITE_QUERY };
