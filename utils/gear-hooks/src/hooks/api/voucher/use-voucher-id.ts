import { HexString } from '@gear-js/api';
import { useContext, useEffect, useState } from 'react';

import { AccountContext } from 'context';
import { getTypedEntries } from 'utils';

import { useVouchers } from './use-vouchers';

function useVoucherId(programId: HexString | undefined, accountAddress: string | undefined) {
  const { vouchers } = useVouchers(accountAddress);

  const [voucherId, setVoucherId] = useState<HexString>();

  const isVoucherIdReady = voucherId !== undefined;
  const isVoucherExists = !!(isVoucherIdReady && voucherId);

  useEffect(() => {
    setVoucherId(undefined);

    if (!vouchers || !programId) return;

    const [result] = getTypedEntries(vouchers).find(([, programIds]) => programIds.includes(programId)) || [
      '' as HexString,
    ];

    setVoucherId(result);
  }, [vouchers, accountAddress, programId]);

  return { voucherId, isVoucherIdReady, isVoucherExists };
}

function useAccountVoucherId(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucherId(programId, account?.address);
}

export { useVoucherId, useAccountVoucherId };
