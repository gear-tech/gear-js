import { HexString } from '@gear-js/api';
import { useApi, useAlert, useAccount } from 'hooks/context';
import { useState, useEffect } from 'react';

function useVouchers(accountAddress: string | undefined) {
  const { api } = useApi();
  const alert = useAlert();

  const [vouchers, setVouchers] = useState<Record<HexString, string[]>>();

  useEffect(() => {
    if (!api || !accountAddress) return setVouchers(undefined);

    api.voucher
      .getAllForAccount(accountAddress)
      .then((result) => setVouchers(result))
      .catch(({ message }) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accountAddress]);

  return vouchers;
}

function useAccountVouchers() {
  const { account } = useAccount();

  return useVouchers(account?.address);
}

export { useVouchers, useAccountVouchers };
