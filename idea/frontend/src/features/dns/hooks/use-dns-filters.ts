import { useAccount } from '@gear-js/react-hooks';
import { useMemo, useState } from 'react';
import { SortDirection } from '../types';

const DEFAULT_FILTER_VALUES = {
  owner: 'all',
  orderByField: 'updatedAt',
  orderByDirection: 'DESC' as SortDirection,
};

function useDnsFilters() {
  const { account } = useAccount();
  const [values, setValues] = useState(DEFAULT_FILTER_VALUES);
  const { orderByField, orderByDirection } = values;

  const getOwnerParams = () => {
    if (!account) return {};

    const { decodedAddress } = account;
    const { owner } = values;

    return owner === 'all' ? {} : { createdBy: decodedAddress };
  };

  const params = useMemo(() => ({ ...getOwnerParams(), orderByField, orderByDirection }), [values, account]);

  return [values, params, setValues] as const;
}

export { useDnsFilters };
