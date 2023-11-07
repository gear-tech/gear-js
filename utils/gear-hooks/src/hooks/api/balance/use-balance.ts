import { Balance } from '@polkadot/types/interfaces';
import { useContext, useEffect, useState } from 'react';
import { AlertContext, ApiContext } from 'context';

function useBalance(address: string | undefined) {
  const { api, isApiReady } = useContext(ApiContext);
  const alert = useContext(AlertContext);

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
