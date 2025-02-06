import { LocalStorage, GEAR_EXE_NODE_ADDRESS } from '@/shared/config';

import { getNodeAddressFromUrl } from './utils';

// ! TODO: move to nodesSwitch
const INITIAL_ENDPOINT = getNodeAddressFromUrl() || (localStorage[LocalStorage.Node] as string | null) || GEAR_EXE_NODE_ADDRESS;

export { INITIAL_ENDPOINT };
