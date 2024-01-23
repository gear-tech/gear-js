import { HexString } from '@gear-js/api';
import { useContext, useEffect, useState } from 'react';

import { AccountContext } from 'context';
import { getTypedEntries } from 'utils';

import { useVouchers } from './use-vouchers';

function useVoucherId(accountAddress: string | undefined, programId: HexString | undefined) {
  const { vouchers } = useVouchers(accountAddress);

  const [voucherId, setVoucherId] = useState<HexString | ''>();
  const isVoucherIdReady = voucherId !== undefined;

  useEffect(() => {
    if (!vouchers || !programId) return setVoucherId(undefined);

    const [result] = getTypedEntries(vouchers).find(([, programIds]) => programIds.includes(programId)) || [''];

    setVoucherId(result);
  }, [vouchers, accountAddress, programId]);

  return { voucherId, isVoucherIdReady };
}

function useAccountVoucherId(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucherId(account?.address, programId);
}

export { useVoucherId, useAccountVoucherId };
