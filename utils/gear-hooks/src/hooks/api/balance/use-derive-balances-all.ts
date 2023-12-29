import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { useContext, useEffect, useState } from 'react';
import { AccountContext, ApiContext } from 'context';

function useDeriveBalancesAll(accountAddress: string | undefined) {
  const { api, isApiReady } = useContext(ApiContext);

  const [balances, setBalances] = useState<DeriveBalancesAll>();

  useEffect(() => {
    if (!accountAddress || !isApiReady) return;

    const unsub = api.derive.balances.all(accountAddress, (result) => setBalances(result));

    return () => {
      setBalances(undefined);
      unsub.then((unsubCallback) => unsubCallback()).catch(console.error);
    };
  }, [accountAddress, api, isApiReady]);

  return balances;
}

function useAccountDeriveBalancesAll() {
  const { account } = useContext(AccountContext);

  return useDeriveBalancesAll(account?.address);
}

export { useDeriveBalancesAll, useAccountDeriveBalancesAll };
