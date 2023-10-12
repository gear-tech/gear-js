import { Balance } from '@polkadot/types/interfaces';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AlertContext, ApiContext } from 'context';
import { formatBalance } from '@polkadot/util';

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

  // standalone hook?
  const formattedBalance = useMemo(() => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!balance) return;

    const [decimals] = api.registry.chainDecimals;
    const [unit] = api.registry.chainTokens;

    const value = formatBalance(balance, {
      decimals,
      forceUnit: unit,
      withSiFull: false,
      withSi: false,
      withUnit: unit,
    });

    return { value, unit };
  }, [balance]);

  return { balance, formattedBalance, isBalanceReady };
}

export { useBalance };
