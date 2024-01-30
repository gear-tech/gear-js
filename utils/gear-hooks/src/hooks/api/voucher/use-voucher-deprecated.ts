import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';

import { AccountContext } from 'context';

import { useVoucherBalanceDeprecated } from './use-voucher-balance-deprecated';
import { useIsVoucherExists } from './use-is-voucher-exists';

function useVoucherDeprecated(programId: HexString | undefined, accountAddress: HexString | undefined) {
  const { isVoucherExists, isVoucherExistsReady } = useIsVoucherExists(programId, accountAddress);
  const { voucherBalance, isVoucherBalanceReady } = useVoucherBalanceDeprecated(programId, accountAddress);

  const isVoucherReady = isVoucherExistsReady && isVoucherBalanceReady;

  return { isVoucherExists, voucherBalance, isVoucherReady };
}

function useAccountVoucherDeprecated(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useVoucherDeprecated(programId, account?.decodedAddress);
}

export { useVoucherDeprecated, useAccountVoucherDeprecated };
