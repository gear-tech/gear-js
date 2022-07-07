import { NODE_ADDRESS, LOCAL_STORAGE } from 'consts';

import { getNodeAddressFromUrl } from './helpers';

export const NODE_API_ADDRESS =
  getNodeAddressFromUrl() || localStorage.getItem(LOCAL_STORAGE.NODE_ADDRESS) || NODE_ADDRESS;
