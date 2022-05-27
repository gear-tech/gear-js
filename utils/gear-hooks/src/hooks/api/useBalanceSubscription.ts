import { UnsubscribePromise } from '@polkadot/api/types';
import { useEffect } from 'react';
import { useAccount, useApi } from '../context';

function useBalanceSubscription() {
  const { api } = useApi();
  const { account, updateBalance } = useAccount();

  const { address } = account || {};

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (address) {
      unsub = api?.gearEvents.subscribeToBalanceChange(address, updateBalance);
    }

    return () => {
      if (unsub) unsub.then((callback) => callback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, address]);
}

export { useBalanceSubscription };
