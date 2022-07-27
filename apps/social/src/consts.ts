import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  ROUTER_CONTRACT: process.env.REACT_APP_ROUTER_CONTRACT_ADDRESS as Hex,
};

const IDE_BACKEND_ADDRESS = process.env.REACT_APP_IDE_BACKEND_ADDRESS as string;

const FILTERS = ['All Channels', 'My'];
const FILTERS_2 = ['All Channels', 'My Feed'];

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
  GENESIS: 'genesis',
};

export { ADDRESS, LOCAL_STORAGE, FILTERS, FILTERS_2, IDE_BACKEND_ADDRESS };
