import { useAccount } from '@gear-js/react-hooks';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { OwnerFilter } from '@/api/consts';

import { DEFAULT_FILTER_VALUES } from '../consts';

type Location = {
  state: typeof DEFAULT_FILTER_VALUES | null;
};

function useProgramFilters(query: string) {
  const location = useLocation() as Location;
  const { account } = useAccount();

  // TODO: handle location.state in a params, not in state. right now code related programs are not working
  const [filterValues, setFilterValues] = useState(location.state ?? DEFAULT_FILTER_VALUES);

  const filterParams = useMemo(() => {
    const owner = filterValues.owner === OwnerFilter.All ? undefined : account?.decodedAddress;
    const status = filterValues.status && filterValues.status.length > 0 ? filterValues.status : undefined;

    return { query, owner, status };
  }, [query, filterValues, account]);

  return [filterValues, setFilterValues, filterParams] as const;
}

export { useProgramFilters };
