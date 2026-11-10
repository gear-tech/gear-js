import { LocalStorage, NODE_ADDRESS, resolveInitialNetwork } from '@/shared/config';

import { getNodeAddressFromUrl } from './utils';

const { endpoint: INITIAL_ENDPOINT, requiresSelection: REQUIRES_NETWORK_SELECTION } = resolveInitialNetwork({
  urlNode: getNodeAddressFromUrl(),
  savedNode: localStorage.getItem(LocalStorage.Node),
  savedGenesis: localStorage.getItem(LocalStorage.Genesis),
  defaultEndpoint: NODE_ADDRESS,
});

export { INITIAL_ENDPOINT, REQUIRES_NETWORK_SELECTION };
