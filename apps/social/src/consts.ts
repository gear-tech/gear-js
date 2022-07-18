import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  ROUTER_CONTRACT: process.env.REACT_APP_ROUTER_CONTRACT_ADDRESS as Hex,
};

const IDE_BACKEND_ADDRESS = process.env.REACT_APP_IDE_BACKEND_ADDRESS as string

const FILTERS = ['All Channels', 'My'];
const GENESIS = '0x57b13b5e31bd54764166c243b92ee742d9ea706947558b43ba86586f8de07be4'

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export { ADDRESS, LOCAL_STORAGE, FILTERS, IDE_BACKEND_ADDRESS, GENESIS };
