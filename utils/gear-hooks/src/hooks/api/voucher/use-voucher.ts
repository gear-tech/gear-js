import { HexString } from '@polkadot/util/types';

import { useIsVoucherExists } from './use-is-voucher-exists';
import { useVoucherBalance } from './use-voucher-balance';

function useVoucher(programId: HexString | undefined, accountAddress: HexString | undefined) {
  const { isVoucherExists, isVoucherExistsReady } = useIsVoucherExists(programId, accountAddress);
  const { voucherBalance, isVoucherBalanceReady } = useVoucherBalance(programId, accountAddress);

  const isVoucherReady = isVoucherExistsReady && isVoucherBalanceReady;

  return { isVoucherExists, voucherBalance, isVoucherReady };
}

export { useVoucher };
