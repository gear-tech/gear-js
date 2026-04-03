import type { HexString, IVoucherDetails } from '@gear-js/api';
import { useEffect, useState } from 'react';

import { useAccount, useAlert, useApi } from '@/context';

function useVouchers(
  ...args: [accountAddress: string | undefined] | [accountAddress: string | undefined, programId?: HexString]
) {
  const [accountAddress, programId] = args;
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const [vouchers, setVouchers] = useState<Record<HexString, IVoucherDetails>>();
  const isEachVoucherReady = vouchers !== undefined;

  useEffect(() => {
    setVouchers(undefined);

    const isProgramIdSpecified = args.length > 1;
    if (!isApiReady || !accountAddress || (isProgramIdSpecified && !programId)) return;

    api.voucher
      .getAllForAccount(accountAddress, programId)
      .then((result) => setVouchers(result))
      .catch((error) => alert.error(error instanceof Error ? error.message : String(error)));
  }, [isApiReady, api, accountAddress, programId]);

  return { vouchers, isEachVoucherReady };
}

function useAccountVouchers(...args: [] | [programId?: HexString]) {
  const { account } = useAccount();
  const [programId] = args;

  const voucherArgs: Parameters<typeof useVouchers> = args.length ? [account?.address, programId] : [account?.address];

  return useVouchers(...voucherArgs);
}

export { useAccountVouchers, useVouchers };
