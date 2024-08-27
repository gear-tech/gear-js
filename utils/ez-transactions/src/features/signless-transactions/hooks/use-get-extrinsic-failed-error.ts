import { useApi } from '@gear-js/react-hooks';
import { Event } from '@polkadot/types/interfaces';

function useGetExtrinsicFailedError() {
  const { api, isApiReady } = useApi();

  const getExtrinsicFailedError = (event: Event) => {
    if (!isApiReady) throw new Error('API is not initialized');

    const { name, method, docs } = api.getExtrinsicFailedError(event);

    return `${name}.${method}: ${docs}`;
  };

  return { getExtrinsicFailedError };
}

export { useGetExtrinsicFailedError };
