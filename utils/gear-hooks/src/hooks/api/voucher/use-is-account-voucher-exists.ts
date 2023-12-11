import { HexString } from '@gear-js/api';
import { useIsVoucherExists } from './use-is-voucher-exists';
import { useContext } from 'react';
import { AccountContext } from 'context';

function useIsAccountVoucherExists(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useIsVoucherExists(programId, account?.decodedAddress);
}

export { useIsAccountVoucherExists };
