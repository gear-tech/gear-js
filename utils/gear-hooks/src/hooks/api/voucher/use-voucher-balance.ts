import { HexString, generateVoucherId } from '@gear-js/api';
import { AccountContext } from 'context';
import { useContext } from 'react';
import { useBalance } from '../balance/use-balance';

function useVoucherBalance(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);
  const accountAddress = account?.decodedAddress;

  const { balance, isBalanceReady } = useBalance(
    programId && accountAddress ? generateVoucherId(accountAddress, programId) : undefined,
  );

  return { voucherBalance: balance, isVoucherBalanceReady: isBalanceReady };
}

export { useVoucherBalance };
