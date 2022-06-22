import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  LOTTERY_CONTRACT: process.env.REACT_APP_LOTTERY_CONTRACT_ADDRESS as Hex,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const STATUS = {
  PENDING: 'In progress',
  FINISHED: 'Finished',
};

const MULTIPLIER = {
  MILLISECONDS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
};

export { ADDRESS, LOCAL_STORAGE, STATUS, MULTIPLIER };
