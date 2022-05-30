import { UnsubscribePromise } from '@polkadot/api/types';
import { useEffect } from 'react';
import { useAccount, useApi } from './context';

function useBalanceSubscription() {
  const { api } = useApi();
  const { account, updateBalance } = useAccount();

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (account) {
      unsub = api?.gearEvents.subscribeToBalanceChange(account.address, updateBalance);
    }

    return () => {
      if (unsub) unsub.then((callback) => callback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, account]);
}

export { useBalanceSubscription };
