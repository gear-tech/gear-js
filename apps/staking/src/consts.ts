import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const STAKING_CONTRACT_ADDRESS = process.env.REACT_APP_STAKING_CONTRACT_ADDRESS as Hex;

const TIME = {
  YEAR: 3.154e10,
  MONTH: 2.628e9,
  DAY: 8.64e7,
  HOUR: 3.6e6,
  MINUTE: 6e4,
};

export { TIME, ADDRESS, LOCAL_STORAGE, STAKING_CONTRACT_ADDRESS };
