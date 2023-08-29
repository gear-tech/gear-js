import { HexString, generateVoucherId } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import { useBalanceMultiplier } from 'hooks';

function useVoucherBalance(programId: HexString | undefined) {
  const { api } = useApi();
  const alert = useAlert();

  const { account } = useAccount();
  const accountAddress = account?.decodedAddress;

  const { balanceMultiplier } = useBalanceMultiplier();

  const [voucherBalance, setVoucherBalance] = useState<string>();
  const isVoucherBalanceReady = voucherBalance !== undefined;

  useEffect(() => {
    setVoucherBalance(undefined);

    if (!programId || !accountAddress) return;

    const id = generateVoucherId(accountAddress, programId);

    api.balance
      .findOut(id)
      .then((result) => {
        const unitBalance = BigNumber(result.toString()).dividedBy(balanceMultiplier).toFixed();

        setVoucherBalance(unitBalance);
      })
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, programId]);

  return { voucherBalance, isVoucherBalanceReady };
}

export { useVoucherBalance };
