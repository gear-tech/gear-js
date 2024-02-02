import { HexString, IVoucherDetails } from '@gear-js/api';
import { useState, useEffect, useContext } from 'react';

import { AccountContext, AlertContext, ApiContext } from 'context';

function useVouchers(accountAddress: string | undefined, programId?: HexString | undefined) {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const [vouchers, setVouchers] = useState<Record<HexString, IVoucherDetails>>();
  const isEachVoucherReady = vouchers !== undefined;

  const getVouchers = async (_accountAddress: string, _programId?: HexString) => {
    if (!isApiReady) throw new Error('API is not initialized');

    return api.voucher.getAllForAccount(_accountAddress, _programId);
  };

  useEffect(() => {
    setVouchers(undefined);

    const isProgramIdSpecified = arguments.length > 1;
    if (!api || !accountAddress || (isProgramIdSpecified && !programId)) return;

    getVouchers(accountAddress, programId)
      .then((result) => setVouchers(result))
      .catch(({ message }) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accountAddress, programId]);

  return { vouchers, isEachVoucherReady };
}

function useAccountVouchers(programId?: HexString | undefined) {
  const { account } = useContext(AccountContext);

  const args: Parameters<typeof useVouchers> = arguments.length ? [account?.address, programId] : [account?.address];

  return useVouchers(...args);
}

export { useVouchers, useAccountVouchers };
