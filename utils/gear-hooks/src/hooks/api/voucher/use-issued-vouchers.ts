import { useEffect, useState } from 'react';

import { useAccount, useAlert, useApi } from '@/context';

function useIssuedVouchers(accountAddress: string | undefined) {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const [vouchers, setVouchers] = useState<string[]>();
  const isEachVoucherReady = vouchers !== undefined;

  useEffect(() => {
    setVouchers(undefined);

    if (!accountAddress || !isApiReady) return;

    api.voucher
      .getAllIssuedByAccount(accountAddress)
      .then((result) => setVouchers(result))
      .catch(({ message }: Error) => alert.error(message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, api, isApiReady]);

  return { vouchers, isEachVoucherReady };
}

function useAccountIssuedVouchers() {
  const { account } = useAccount();

  return useIssuedVouchers(account?.address);
}

export { useIssuedVouchers, useAccountIssuedVouchers };
