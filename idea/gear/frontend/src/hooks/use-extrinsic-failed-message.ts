import { useApi } from '@gear-js/react-hooks';
import { Event } from '@polkadot/types/interfaces';

function useExtrinsicFailedMessage() {
  const { api, isApiReady } = useApi();

  const getExtrinsicFailedMessage = (event: Event) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { docs, method } = api.getExtrinsicFailedError(event);

    return `${method}: ${docs}`;
  };

  return getExtrinsicFailedMessage;
}

export { useExtrinsicFailedMessage };
