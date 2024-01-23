import { HexString, generateVoucherId } from '@gear-js/api';
import { useContext } from 'react';

import { useBalance } from '../balance/use-balance';
import { AccountContext } from 'context';

function useVoucherBalance(programId: HexString | undefined, accountAddress: HexString | undefined) {
  const { balance, isBalanceReady } = useBalance(
    programId && accountAddress ? generateVoucherId(accountAddress, programId) : undefined,
  );

  return { voucherBalance: balance, isVoucherBalanceReady: isBalanceReady };
}

function useAccountVoucherBalance(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucherBalance(programId, account?.decodedAddress);
}

export { useVoucherBalance, useAccountVoucherBalance };
