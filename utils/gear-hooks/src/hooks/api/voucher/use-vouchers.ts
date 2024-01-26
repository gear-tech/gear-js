import { HexString, IVoucherDetails } from '@gear-js/api';
import { useState, useEffect, useContext } from 'react';

import { AccountContext, AlertContext, ApiContext } from 'context';
import { getTypedEntries } from 'utils';

function useVouchers(accountAddress: string | undefined, programId?: HexString | undefined) {
  const { api } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const [vouchers, setVouchers] = useState<Record<HexString, IVoucherDetails>>();
  const isEachVoucherReady = vouchers !== undefined;

  useEffect(() => {
    setVouchers(undefined);

    if (!api || !accountAddress) return;

    api.voucher
      .getAllForAccount(accountAddress)
      .then((result) => {
        const programsResult = programId
          ? Object.fromEntries(
              Object.entries(result).filter(([, { programs }]) => !programs.length || programs.includes(programId)),
            )
          : result;

        setVouchers(programsResult);
      })
      .catch(({ message }) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accountAddress, programId]);

  return { vouchers, isEachVoucherReady };
}

function useAccountVouchers(programId?: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVouchers(account?.address, programId);
}

export { useVouchers, useAccountVouchers };
