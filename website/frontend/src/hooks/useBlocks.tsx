import { UnsubscribePromise } from '@polkadot/api/types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBlockAction } from 'store/actions/actions';
import { useApi } from './useApi';

export function useBlocks() {
  const [api] = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api) {
      unsub = api.gearEvents.subscribeToNewBlocks((event) => {
        dispatch(
          fetchBlockAction({
            hash: event.hash.toHex(),
            number: event.number.toNumber(),
          })
        );
      });
    }

    return () => {
      if (unsub) {
        (async () => {
          (await unsub)();
        })();
      }
    };
  }, [api, dispatch]);
}
