import { HexString } from '@gear-js/api';
import { useState, useEffect } from 'react';

import { useAccount, useAlert, useApi } from '@/context';

function useIsVoucherExists(programId: HexString | undefined, accountAddress: HexString | undefined) {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const [isVoucherExists, setIsVoucherExists] = useState<boolean>();
  const isVoucherExistsReady = isVoucherExists !== undefined;

  useEffect(() => {
    setIsVoucherExists(undefined);

    if (!programId || !isApiReady || !accountAddress) return;

    api.voucher
      .exists(accountAddress, programId)
      .then((result) => setIsVoucherExists(result))
      .catch(({ message }: Error) => alert.error(message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, accountAddress, programId]);

  return { isVoucherExists, isVoucherExistsReady };
}

function useIsAccountVoucherExists(programId: HexString | undefined) {
  const { account } = useAccount();

  return useIsVoucherExists(programId, account?.decodedAddress);
}

export { useIsVoucherExists, useIsAccountVoucherExists };
