import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  ROUTER_CONTRACT: process.env.REACT_APP_ROUTER_CONTRACT_ADDRESS as Hex,
};

const FILTERS = ['All Channels', 'My'];

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export { ADDRESS, LOCAL_STORAGE, FILTERS };
