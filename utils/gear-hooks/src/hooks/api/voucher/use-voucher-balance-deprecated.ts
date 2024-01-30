import { HexString, generateVoucherId } from '@gear-js/api';
import { useContext } from 'react';

import { AccountContext } from 'context';

import { useBalance } from '../balance';

function useVoucherBalanceDeprecated(programId: HexString | undefined, accountAddress: HexString | undefined) {
  const { balance, isBalanceReady } = useBalance(
    programId && accountAddress ? generateVoucherId(accountAddress, programId) : undefined,
  );

  return { voucherBalance: balance, isVoucherBalanceReady: isBalanceReady };
}

function useAccountVoucherBalanceDeprecated(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucherBalanceDeprecated(programId, account?.decodedAddress);
}

export { useVoucherBalanceDeprecated, useAccountVoucherBalanceDeprecated };
