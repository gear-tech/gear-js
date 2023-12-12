import { useContext } from 'react';
import { useVoucher } from './use-voucher';
import { AccountContext } from 'context';
import { HexString } from '@gear-js/api';

function useAccountVoucher(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucher(programId, account?.decodedAddress);
}

export { useAccountVoucher };
