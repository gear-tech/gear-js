import { HexString, generateVoucherId } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';
import { AccountContext, AlertContext, ApiContext } from 'context';
import { useContext, useEffect, useState } from 'react';

function useVoucherBalance(programId: HexString | undefined) {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

  const { account } = useContext(AccountContext);
  const accountAddress = account?.decodedAddress;

  const [voucherBalance, setVoucherBalance] = useState<string>();
  const isVoucherBalanceReady = voucherBalance !== undefined;

  const voucherId = programId && accountAddress ? generateVoucherId(accountAddress, programId) : undefined;

  useEffect(() => {
    setVoucherBalance(undefined);

    if (!isApiReady || !voucherId) return;

    api.balance
      .findOut(voucherId)
      .then((result) => setVoucherBalance(result.toString()))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, voucherId]);

  // TODO: useBalanceSubscription, same as in Account context
  useEffect(() => {
    if (!isApiReady || !voucherId) return;

    const unsub = api.gearEvents.subscribeToBalanceChanges(voucherId, (result) => setVoucherBalance(result.toString()));

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, voucherId]);

  return { voucherBalance, isVoucherBalanceReady };
}

export { useVoucherBalance };
