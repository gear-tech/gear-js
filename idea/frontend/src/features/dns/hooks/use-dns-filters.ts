import { useAccount } from '@gear-js/react-hooks';
import { useMemo, useState } from 'react';

const DEFAULT_FILTER_VALUES = {
  owner: 'all',
};

function useDnsFilters() {
  const { account } = useAccount();
  const [values, setValues] = useState(DEFAULT_FILTER_VALUES);

  const getOwnerParams = () => {
    if (!account) return {};

    const { decodedAddress } = account;
    const { owner } = values;

    return owner === 'all' ? {} : { createdBy: decodedAddress };
  };

  const params = useMemo(() => getOwnerParams(), [values, account]);

  return [values, params, setValues] as const;
}

export { useDnsFilters };
