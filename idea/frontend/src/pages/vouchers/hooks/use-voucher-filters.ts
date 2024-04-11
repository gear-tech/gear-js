import { useAccount } from '@gear-js/react-hooks';
import { useMemo, useState } from 'react';

const DEFAULT_FILTER_VALUES = {
  owner: 'all',
  status: [] as ('active' | 'declined' | 'expired')[],
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

    const active = status.includes('active');
    const declined = status.includes('declined');
    const expired = status.includes('expired');

    const result = {} as Record<'declined' | 'expired', boolean>;

    if (active) {
      if (declined && expired) return {};

      result.declined = false;
      result.expired = false;
    }

    if (declined) result.declined = true;
    if (expired) result.expired = true;

    return result;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params = useMemo(() => ({ ...getOwnerParams(), ...getStatusParams() }), [values, account]);

  return [values, params, setValues] as const;
}

export { useVoucherFilters };
