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

    const _vouchers = await api.voucher.getAllForAccount(_accountAddress);

    if (!_programId) return _vouchers;

    const entries = Object.entries(_vouchers);
    const entriesForProgram = entries.filter(([, { programs }]) => !programs.length || programs.includes(_programId));

    return Object.fromEntries(entriesForProgram);
  };

  useEffect(() => {
    setVouchers(undefined);

    if (!api || !accountAddress) return;

    getVouchers(accountAddress, programId)
      .then((result) => setVouchers(result))
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
