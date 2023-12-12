import { HexString, generateVoucherId } from '@gear-js/api';

import { useBalance } from '../balance/use-balance';

function useVoucherBalance(programId: HexString | undefined, accountAddress: HexString | undefined) {
  const { balance, isBalanceReady } = useBalance(
    programId && accountAddress ? generateVoucherId(accountAddress, programId) : undefined,
  );

  return { voucherBalance: balance, isVoucherBalanceReady: isBalanceReady };
}

export { useVoucherBalance };
