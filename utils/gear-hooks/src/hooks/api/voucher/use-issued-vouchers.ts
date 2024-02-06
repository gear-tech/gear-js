import { useContext, useEffect, useState } from 'react';

import { AccountContext, AlertContext, ApiContext } from 'context';

function useIssuedVouchers(accountAddress: string | undefined) {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const [vouchers, setVouchers] = useState<string[]>();
  const isEachVoucherReady = vouchers !== undefined;

  useEffect(() => {
    setVouchers(undefined);

    if (!accountAddress || !isApiReady) return;

    api.voucher
      .getAllIssuedByAccount(accountAddress)
      .then((result) => setVouchers(result))
      .catch(({ message }: Error) => alert.error(message));
  }, [accountAddress, api, isApiReady]);

  return { vouchers, isEachVoucherReady };
}

function useAccountIssuedVouchers() {
  const { account } = useContext(AccountContext);

  return useIssuedVouchers(account?.address);
}

export { useIssuedVouchers, useAccountIssuedVouchers };
