import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  AUCTION_CONTRACT: process.env.REACT_APP_AUCTION_CONTRACT_ADDRESS as Hex,
  IPFS_GATEWAY_ADDRESS: process.env.REACT_APP_IPFS_GATEWAY_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const MULTIPLIER = {
  MILLISECONDS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
};

const MIN_TRANSFER_AMOUNT = 500;

const STATUS = {
  IS_RUNNING: 'IsRunning',
  NONE: 'None',
  EXPIRED: 'Expired',
};

export { ADDRESS, LOCAL_STORAGE, MULTIPLIER, MIN_TRANSFER_AMOUNT, STATUS };
