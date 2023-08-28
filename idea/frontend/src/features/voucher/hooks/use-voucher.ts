import { HexString } from '@gear-js/api';

import { useIsVoucherExists } from './use-is-voucher-exists';
import { useVoucherBalance } from './use-voucher-balance';

function useVoucher(programId: HexString | undefined) {
  const { isVoucherExists } = useIsVoucherExists(programId);
  const { voucherBalance } = useVoucherBalance(programId);

  return { isVoucherExists, voucherBalance };
}

export { useVoucher };
