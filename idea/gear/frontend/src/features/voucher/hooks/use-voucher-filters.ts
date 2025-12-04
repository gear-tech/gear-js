import { useAccount } from '@gear-js/react-hooks';
import { parseAsStringEnum } from 'nuqs';
import { useMemo } from 'react';

import { useChangeEffect, useSearchParamsStates } from '@/hooks';

import { DEFAULT_FILTER_VALUE, FILTER_NAME, FILTER_VALUE, FILTER_VALUES } from '../consts';

function useVoucherFilters() {
  const { account } = useAccount();

  // fallback to default value on no account
  const ownerValues = account ? FILTER_VALUES.OWNER : [DEFAULT_FILTER_VALUE.OWNER];

  const [values, setValues] = useSearchParamsStates({
    [FILTER_NAME.OWNER]: parseAsStringEnum(ownerValues).withDefault(DEFAULT_FILTER_VALUE.OWNER),
    [FILTER_NAME.STATUS]: parseAsStringEnum(FILTER_VALUES.STATUS).withDefault(DEFAULT_FILTER_VALUE.STATUS),
  });

  const getOwnerParams = () => {
    if (!account) return {};

    const { decodedAddress } = account;
    const { owner } = values;

    switch (owner) {
      case FILTER_VALUE.OWNER.BY:
        return { owner: decodedAddress };
      case FILTER_VALUE.OWNER.TO:
        return { spender: decodedAddress };
      default:
        return {};
    }
  };

  const getStatusParams = () => {
    const { status } = values;

    if (status === FILTER_VALUE.STATUS.ACTIVE) return { declined: false, expired: false };

    return status ? { [status]: true } : {};
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params = useMemo(() => ({ ...getOwnerParams(), ...getStatusParams() }), [values, account]);

  useChangeEffect(() => {
    if (!account) void setValues((prevValues) => ({ ...prevValues, [FILTER_NAME.OWNER]: DEFAULT_FILTER_VALUE.OWNER }));
  }, [account]);

  return [values, params, setValues] as const;
}

export { useVoucherFilters };
