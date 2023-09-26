import { HexString, generateVoucherId } from '@gear-js/api';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { useContext, useEffect, useState } from 'react';

function useVoucherBalance(programId: HexString | undefined) {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const { account } = useContext(AccountContext);
  const accountAddress = account?.decodedAddress;

  const [voucherBalance, setVoucherBalance] = useState<string>();
  const isVoucherBalanceReady = voucherBalance !== undefined;

  useEffect(() => {
    setVoucherBalance(undefined);

    if (!programId || !isApiReady || !accountAddress) return;

    const id = generateVoucherId(accountAddress, programId);

    api.balance
      .findOut(id)
      .then((result) => setVoucherBalance(result.toString()))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, accountAddress, programId]);

  return { voucherBalance, isVoucherBalanceReady };
}

export { useVoucherBalance };
