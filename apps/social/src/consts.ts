import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  ROUTER_CONTRACT: process.env.REACT_APP_ROUTER_CONTRACT_ADDRESS as Hex,
};

const META_STORAGE_ADDRESS = process.env.REACT_APP_META_STORAGE_API as string;

const FILTERS = ['All Channels', 'My'];
const FILTERS_2 = ['All Channels', 'My Feed'];

const LOCAL_STORAGE = {
  ACCOUNT: 'account'
};

export { ADDRESS, LOCAL_STORAGE, FILTERS, FILTERS_2, META_STORAGE_ADDRESS };
