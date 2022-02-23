import { UnsubscribePromise } from '@polkadot/api/types';
import { useEffect } from 'react';
import { useApi } from './useApi';

export function useSubscription(callback: () => UnsubscribePromise) {
  const [api] = useApi();

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
