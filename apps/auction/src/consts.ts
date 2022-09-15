const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  IPFS_GATEWAY_ADDRESS: process.env.REACT_APP_IPFS_GATEWAY_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
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
