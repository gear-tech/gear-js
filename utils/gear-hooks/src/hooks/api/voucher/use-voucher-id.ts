import { HexString } from '@gear-js/api';
import { useContext } from 'react';

import { AccountContext } from 'context';

import { useVouchers } from './use-vouchers';

function useVoucherId(programId: HexString | undefined, accountAddress: string | undefined) {
  const { vouchers, isEachVoucherReady } = useVouchers(accountAddress, programId);

  const ids = Object.keys(vouchers || {});
  const voucherId = ids[0] as HexString | undefined;

  const isVoucherIdReady = isEachVoucherReady;
  const isVoucherExists = !!(isVoucherIdReady && voucherId);

  return { voucherId, isVoucherIdReady, isVoucherExists };
}

function useAccountVoucherId(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucherId(programId, account?.address);
}

export { useVoucherId, useAccountVoucherId };
