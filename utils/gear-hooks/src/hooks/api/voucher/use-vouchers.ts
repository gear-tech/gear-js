import { HexString } from '@gear-js/api';
import { useState, useEffect, useContext } from 'react';

import { AccountContext, AlertContext, ApiContext } from 'context';

function useVouchers(accountAddress: string | undefined) {
  const { api } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const [vouchers, setVouchers] = useState<Record<HexString, string[]>>();
  const isEachVoucherReady = vouchers !== undefined;

  useEffect(() => {
    setVouchers(undefined);

    if (!api || !accountAddress) return;

    api.voucher
      .getAllForAccount(accountAddress)
      .then((result) => setVouchers(result))
      .catch(({ message }) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accountAddress]);

  return { vouchers, isEachVoucherReady };
}

function useAccountVouchers() {
  const { account } = useContext(AccountContext);

  return useVouchers(account?.address);
}

export { useVouchers, useAccountVouchers };
