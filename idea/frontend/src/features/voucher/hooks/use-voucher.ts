import { HexString, generateVoucherId } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { useIsVoucherExists } from './use-is-voucher-exists';

function useVoucher(programId: HexString | undefined) {
  const { api } = useApi();
  const alert = useAlert();

  const { account } = useAccount();
  const accountAddress = account?.decodedAddress;

  const { isVoucherExists } = useIsVoucherExists(programId);
  const [voucherValue, setVoucherValue] = useState('0');

  useEffect(() => {
    if (!programId || !isVoucherExists || !accountAddress) return;

    const id = generateVoucherId(accountAddress, programId);

    api.balance
      .findOut(id)
      .then((result) => setVoucherValue(result.toString()))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoucherExists, accountAddress, programId]);

  return { isVoucherExists, voucherValue };
}

export { useVoucher };
