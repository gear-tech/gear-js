import { useMemo, useState } from 'react';
import { DEFAULT_FILTER_VALUES } from '../consts';
import { useAccount } from '@gear-js/react-hooks';
import { useLocation } from 'react-router-dom';
import { OwnerFilter } from '@/api/consts';

type Location = {
  state: typeof DEFAULT_FILTER_VALUES | null;
};

function useProgramFilters(query: string) {
  const location = useLocation() as Location;
  const { account } = useAccount();

  const [filterValues, setFilterValues] = useState(location.state ?? DEFAULT_FILTER_VALUES);

  const filterParams = useMemo(() => {
    const owner = filterValues.owner === OwnerFilter.All ? undefined : account?.decodedAddress;
    const status = filterValues.status && filterValues.status.length > 0 ? filterValues.status : undefined;

    return { query, owner, status };
  }, [query, filterValues, account]);

  return [filterValues, setFilterValues, filterParams] as const;
}

export { useProgramFilters };
