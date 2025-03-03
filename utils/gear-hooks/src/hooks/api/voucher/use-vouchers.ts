import { HexString, IVoucherDetails } from '@gear-js/api';
import { useState, useEffect } from 'react';

import { useAccount, useAlert, useApi } from '@/context';

function useVouchers(accountAddress: string | undefined, programId?: HexString) {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const [vouchers, setVouchers] = useState<Record<HexString, IVoucherDetails>>();
  const isEachVoucherReady = vouchers !== undefined;

  useEffect(() => {
    setVouchers(undefined);

    const isProgramIdSpecified = arguments.length > 1;
    if (!isApiReady || !accountAddress || (isProgramIdSpecified && !programId)) return;

    api.voucher
      .getAllForAccount(accountAddress, programId)
      .then((result) => setVouchers(result))
      .catch((error) => alert.error(error instanceof Error ? error.message : String(error)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, api, accountAddress, programId]);

  return { vouchers, isEachVoucherReady };
}

function useAccountVouchers(programId?: HexString) {
  const { account } = useAccount();

  const args: Parameters<typeof useVouchers> = arguments.length ? [account?.address, programId] : [account?.address];

  return useVouchers(...args);
}

export { useVouchers, useAccountVouchers };
