import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { OwnerFilter } from '@/api/consts';

import { ProgramsParameters } from '../api';
import { DEFAULT_FILTER_VALUES, ProgramStatus } from '../consts';

type Location = {
  state: Pick<ProgramsParameters, 'codeId'> | null;
};

function useProgramFilters(query: string) {
  const location = useLocation() as Location;
  const [searchParams, setSearchParams] = useSearchParams();
  const { account } = useAccount();

  // TODO: handle location.state in a params, not in state. right now code related programs are not working
  const [filterValues, setFilterValues] = useState(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      owner: (params.owner || DEFAULT_FILTER_VALUES.owner) as OwnerFilter,
      status: (params.status ? params.status.split(',') : DEFAULT_FILTER_VALUES.status) as ProgramStatus[],
    };
  });

  useEffect(() => {
    Object.entries(filterValues).forEach(([key, value]: [string, string | string[]]) => {
      value = Array.isArray(value) ? value.join(',') : value;
      if (key in DEFAULT_FILTER_VALUES && value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    setSearchParams(searchParams, { replace: true });
  }, [filterValues]);

  const filterParams = useMemo(() => {
    const { codeId } = location.state || {};

    const owner = filterValues.owner === OwnerFilter.All ? undefined : account?.decodedAddress;
    const status = filterValues.status && filterValues.status.length > 0 ? filterValues.status : undefined;

    return { query, owner, status, codeId };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterValues, account]);

  return [filterValues, setFilterValues, filterParams] as const;
}

export { useProgramFilters };
