import { LocalStorage, NODE_ADDRESS } from 'shared/config';

import { getNodeAddressFromUrl } from './utils';

const INITIAL_ENDPOINT = getNodeAddressFromUrl() || (localStorage[LocalStorage.Node] as string | null) || NODE_ADDRESS;

export { INITIAL_ENDPOINT };
