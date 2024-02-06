import { HexString, IVoucherDetails } from '@gear-js/api';
import { useState, useEffect, useContext } from 'react';

import { AccountContext, AlertContext, ApiContext } from 'context';

function useVouchers(accountAddress: string | undefined, programId?: HexString | undefined) {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const [vouchers, setVouchers] = useState<Record<HexString, IVoucherDetails>>();
  const isEachVoucherReady = vouchers !== undefined;

  useEffect(() => {
    setVouchers(undefined);

    const isProgramIdSpecified = arguments.length > 1;
    if (!isApiReady || !accountAddress || (isProgramIdSpecified && !programId)) return;

    api.voucher
      .getAllForAccount(accountAddress, programId)
      .then((result) => setVouchers(result))
      .catch(({ message }) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, api, accountAddress, programId]);

  return { vouchers, isEachVoucherReady };
}

function useAccountVouchers(programId?: HexString | undefined) {
  const { account } = useContext(AccountContext);

  const args: Parameters<typeof useVouchers> = arguments.length ? [account?.address, programId] : [account?.address];

  return useVouchers(...args);
}

export { useVouchers, useAccountVouchers };
