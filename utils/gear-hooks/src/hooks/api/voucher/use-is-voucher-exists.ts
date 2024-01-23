import { HexString } from '@gear-js/api';
import { useState, useEffect, useContext } from 'react';

import { AccountContext, AlertContext, ApiContext } from 'context';

function useIsVoucherExists(programId: HexString | undefined, accountAddress: HexString | undefined) {
  const { api, isApiReady } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const [isVoucherExists, setIsVoucherExists] = useState<boolean>();
  const isVoucherExistsReady = isVoucherExists !== undefined;

  useEffect(() => {
    setIsVoucherExists(undefined);

    if (!programId || !isApiReady || !accountAddress) return;

    api.voucher
      .exists(programId, accountAddress)
      .then((result) => setIsVoucherExists(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, accountAddress, programId]);

  return { isVoucherExists, isVoucherExistsReady };
}

function useIsAccountVoucherExists(programId: HexString | undefined) {
  const { account } = useContext(AccountContext);

  return useIsVoucherExists(programId, account?.decodedAddress);
}

export { useIsVoucherExists, useIsAccountVoucherExists };
