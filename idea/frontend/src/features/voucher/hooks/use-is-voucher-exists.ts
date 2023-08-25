import { HexString } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { useState, useEffect } from 'react';

function useIsVoucherExists(programId: HexString) {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const { account } = useAccount();
  const accountAddress = account?.decodedAddress;

  const [isVoucherExists, setIsVoucherExists] = useState<boolean>();

  useEffect(() => {
    if (!isApiReady || !accountAddress) return;

    api.voucher
      .exists(programId, accountAddress)
      .then((result) => setIsVoucherExists(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, accountAddress, programId]);

  return { isVoucherExists };
}

export { useIsVoucherExists };
