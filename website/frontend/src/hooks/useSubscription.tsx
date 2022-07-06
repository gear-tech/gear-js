import { useEffect } from 'react';
import { UnsubscribePromise } from '@polkadot/api/types';
import { useApi } from '@gear-js/react-hooks';

export function useSubscription(callback: () => UnsubscribePromise) {
  const { api } = useApi();

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api) {
      unsub = callback();
    }

    return () => {
      if (unsub) {
        (async () => {
          (await unsub)();
        })();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);
}
