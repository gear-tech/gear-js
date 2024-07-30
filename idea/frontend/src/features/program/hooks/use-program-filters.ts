import { useAccount } from '@gear-js/react-hooks';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { OwnerFilter } from '@/api/consts';

import { ProgramsParameters } from '../api';
import { DEFAULT_FILTER_VALUES } from '../consts';

type Location = {
  state: Pick<ProgramsParameters, 'codeId'> | null;
};

function useProgramFilters(query: string) {
  const location = useLocation() as Location;
  const { account } = useAccount();

  // TODO: handle location.state in a params, not in state. right now code related programs are not working
  const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);

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
