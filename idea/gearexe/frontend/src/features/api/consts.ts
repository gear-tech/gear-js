import { LocalStorage, GEAR_API_NODE } from '@/shared/config';

import { getNodeAddressFromUrl } from './utils';

// ! TODO: move to nodesSwitch
const INITIAL_ENDPOINT = getNodeAddressFromUrl() || (localStorage[LocalStorage.Node] as string | null) || GEAR_API_NODE;

export { INITIAL_ENDPOINT };
