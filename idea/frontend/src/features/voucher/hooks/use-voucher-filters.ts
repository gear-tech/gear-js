import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useMemo, useState } from 'react';

import { DEFAULT_FILTER_VALUES } from '../consts';
import { useSearchParams } from 'react-router-dom';

function useVoucherFilters() {
  const { account } = useAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  const [values, setValues] = useState(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      owner: params.owner || DEFAULT_FILTER_VALUES.owner,
      status: params.status || DEFAULT_FILTER_VALUES.status,
    };
  });

  useEffect(() => {
    Object.entries(values).forEach(([key, value]) => {
      if (key in DEFAULT_FILTER_VALUES && value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    setSearchParams(searchParams, { replace: true });
  }, [values]);

  const getOwnerParams = () => {
    if (!account) return {};

    const { decodedAddress } = account;
    const { owner } = values;

    switch (owner) {
      case 'by':
        return { owner: decodedAddress };
      case 'to':
        return { spender: decodedAddress };
      default:
        return {};
    }
  };

  const getStatusParams = () => {
    const { status } = values;

    if (status === 'active') return { declined: false, expired: false };

    return status ? { [status]: true } : {};
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params = useMemo(() => ({ ...getOwnerParams(), ...getStatusParams() }), [values, account]);

  return [params, setValues] as const;
}

export { useVoucherFilters };
