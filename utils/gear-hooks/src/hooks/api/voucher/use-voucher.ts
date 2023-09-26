import { HexString } from '@polkadot/util/types';

import { useIsVoucherExists } from './use-is-voucher-exists';
import { useVoucherBalance } from './use-voucher-balance';

function useVoucher(programId: HexString | undefined) {
  const { isVoucherExists, isVoucherExistsReady } = useIsVoucherExists(programId);
  const { voucherBalance, isVoucherBalanceReady } = useVoucherBalance(programId);

  const isVoucherReady = isVoucherExistsReady && isVoucherBalanceReady;

  return { isVoucherExists, voucherBalance, isVoucherReady };
}

export { useVoucher };
