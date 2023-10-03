import { HexString } from '@gear-js/api';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { useState, useEffect, useContext } from 'react';

function useIsVoucherExists(programId: HexString | undefined) {
  const { api, isApiReady } = useContext(ApiContext); // сircular dependency fix
  const alert = useContext(AlertContext);

  const { account } = useContext(AccountContext);
  const accountAddress = account?.decodedAddress;

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

export { useIsVoucherExists };
