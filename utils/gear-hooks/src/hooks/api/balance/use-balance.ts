import { Balance } from '@polkadot/types/interfaces';
import { useEffect, useState } from 'react';
import { useAlert, useApi } from '@/context';

function useBalance(address: string | undefined) {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const [balance, setBalance] = useState<Balance>();
  const isBalanceReady = balance !== undefined;

  useEffect(() => {
    setBalance(undefined);

    if (!isApiReady || !address) return;

    api.balance
      .findOut(address)
      .then((result) => setBalance(result))
      .catch(({ message }: Error) => alert.error(message));

    const unsub = api.gearEvents.subscribeToBalanceChanges(address, (result) => setBalance(result));

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
  }, [isApiReady, address]);

  return { balance, isBalanceReady };
}

export { useBalance };
