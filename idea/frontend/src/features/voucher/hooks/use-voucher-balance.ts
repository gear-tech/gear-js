import { HexString, generateVoucherId } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

function useVoucherBalance(programId: HexString | undefined) {
  const { api } = useApi();
  const alert = useAlert();

  const { account } = useAccount();
  const accountAddress = account?.decodedAddress;

  const [voucherBalance, setVoucherBalance] = useState('0');

  useEffect(() => {
    if (!programId || !accountAddress) return;

    const id = generateVoucherId(accountAddress, programId);

    api.balance
      .findOut(id)
      .then((result) => setVoucherBalance(result.toHuman()))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, programId]);

  return { voucherBalance };
}

export { useVoucherBalance };
