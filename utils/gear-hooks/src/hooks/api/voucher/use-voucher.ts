import { HexString, IVoucherDetails } from '@gear-js/api';
import { useEffect, useState } from 'react';

import { useAccount, useAlert, useApi } from '@/context';

function useVoucher(voucherId: HexString | undefined, accountAddress: string | undefined) {
  const { api } = useApi();
  const alert = useAlert();

  const [voucher, setVoucher] = useState<IVoucherDetails>();
  const isVoucherReady = voucher !== undefined;

  useEffect(() => {
    setVoucher(undefined);

    if (!api || !accountAddress || !voucherId) return;

    api.voucher
      .getDetails(accountAddress, voucherId)
      .then((result) => setVoucher(result))
      .catch(({ message }) => alert.error(message));
  }, [api, accountAddress, voucherId]);

  return { voucher, isVoucherReady };
}

function useAccountVoucher(voucherId: HexString | undefined) {
  const { account } = useAccount();

  return useVoucher(voucherId, account?.address);
}

export { useVoucher, useAccountVoucher };
