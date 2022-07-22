import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  ROUTER_CONTRACT: process.env.REACT_APP_ROUTER_CONTRACT_ADDRESS as Hex,
};

const IDE_BACKEND_ADDRESS = process.env.REACT_APP_IDE_BACKEND_ADDRESS as string

const FILTERS = ['All Channels', 'My'];
const FILTERS_2 = ['All Channels', 'My Feed'];
const GENESIS = '0x3617a674664505d0eb457413b1ef76bb7df16b58622ede3d8f512cd17f2b0ee9'

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export { ADDRESS, LOCAL_STORAGE, FILTERS, FILTERS_2, IDE_BACKEND_ADDRESS, GENESIS };
