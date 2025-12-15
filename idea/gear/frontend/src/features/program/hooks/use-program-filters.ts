import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { OwnerFilter } from '@/api/consts';
import { useVftWhitelist } from '@/features/vft-whitelist';

import { ProgramsParameters } from '../api';
import { DEFAULT_FILTER_VALUES } from '../consts';

type Location = {
  state: Pick<ProgramsParameters, 'codeId'> | null;
};

function useProgramFilters(query: string, onBatch: () => void) {
  const location = useLocation() as Location;
  const { account } = useAccount();
  const { data: vftPrograms } = useVftWhitelist();

  // TODO: handle location.state in a params, not in state. right now code related programs are not working
  const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);

  const params = useMemo(() => {
    const { codeId } = location.state || {};

    const owner = filterValues.owner === OwnerFilter.All ? undefined : account?.decodedAddress;
    const status = filterValues.status && filterValues.status.length > 0 ? filterValues.status : undefined;

    return { owner, status, codeId };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues, account]);

  const searchParams = useMemo(() => ({ ...params, query }), [params, query]);
  const vftParams = useMemo(() => vftPrograms?.map((id) => ({ ...params, query: id })) || [], [params, vftPrograms]);
  const isBatch = useMemo(() => filterValues.whitelist.includes('vft'), [filterValues]);

  useEffect(() => {
    if (isBatch) onBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBatch]);

  return [{ searchParams, vftParams, isBatch }, setFilterValues] as const;
}

export { useProgramFilters };
