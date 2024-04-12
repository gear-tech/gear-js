import { useAccount } from '@gear-js/react-hooks';
import { useMemo, useState } from 'react';

const DEFAULT_FILTER_VALUES = {
  owner: 'all',
  status: '',
};

function useVoucherFilters() {
  const { account } = useAccount();
  const [values, setValues] = useState(DEFAULT_FILTER_VALUES);

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

  return [values, params, setValues] as const;
}

export { useVoucherFilters };
