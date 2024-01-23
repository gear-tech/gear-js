import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';

import { useIsVoucherExists } from './use-is-voucher-exists';
import { useVoucherBalance } from './use-voucher-balance';
import { AccountContext } from 'context';

function useVoucher(programId: HexString | undefined, accountAddress: HexString | undefined) {
  const { isVoucherExists, isVoucherExistsReady } = useIsVoucherExists(programId, accountAddress);
  const { voucherBalance, isVoucherBalanceReady } = useVoucherBalance(programId, accountAddress);

  const isVoucherReady = isVoucherExistsReady && isVoucherBalanceReady;

  return { isVoucherExists, voucherBalance, isVoucherReady };
}

function useAccountVoucher(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucher(programId, account?.decodedAddress);
}

export { useVoucher, useAccountVoucher };
