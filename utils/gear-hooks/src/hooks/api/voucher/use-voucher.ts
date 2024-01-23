import { HexString, IVoucherDetails } from '@gear-js/api';
import { useContext, useEffect, useState } from 'react';

import { AccountContext, AlertContext, ApiContext } from 'context';

function useVoucher(accountAddress: string | undefined, voucherId: HexString | undefined) {
  const { api } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const [voucher, setVoucher] = useState<IVoucherDetails>();
  const isVoucherReady = voucher !== undefined;

  useEffect(() => {
    if (!api || !accountAddress || !voucherId) return setVoucher(undefined);

    api.voucher
      .getDetails(accountAddress, voucherId)
      .then((result) => setVoucher(result))
      .catch(({ message }) => alert.error(message));
  }, [api, accountAddress, voucherId]);

  return { voucher, isVoucherReady };
}

function useAccountVoucher(voucherId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucher(account?.address, voucherId);
}

export { useVoucher, useAccountVoucher };
