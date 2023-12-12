import { AccountContext } from 'context';
import { useContext } from 'react';
import { useVoucherBalance } from './use-voucher-balance';
import { HexString } from '@gear-js/api';

function useAccountVoucherBalance(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucherBalance(programId, account?.decodedAddress);
}

export { useAccountVoucherBalance };
