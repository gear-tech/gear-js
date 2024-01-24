import { HexString } from '@gear-js/api';
import { useContext } from 'react';

import { AccountContext } from 'context';

import { useBalance } from '../balance';
import { useVoucherId } from './use-voucher-id';

function useVoucherBalance(programId: HexString | undefined, accountAddress: string | undefined) {
  const { voucherId, isVoucherIdReady, isVoucherExists } = useVoucherId(programId, accountAddress);
  const { balance, isBalanceReady } = useBalance(voucherId);

  const voucherBalance = balance;
  const isVoucherBalanceReady = isVoucherExists ? isBalanceReady : isVoucherIdReady;

  return { voucherBalance, isVoucherBalanceReady, isVoucherExists };
}

function useAccountVoucherBalance(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucherBalance(programId, account?.address);
}

export { useVoucherBalance, useAccountVoucherBalance };
