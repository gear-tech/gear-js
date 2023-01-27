import { Hex } from '@gear-js/api';

export const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
};

export const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export const createTamagotchiInitial = {
  programId: '' as Hex,
  currentStep: 1,
};

export const ENV = {
  store: process.env.REACT_APP_STORE_ADDRESS as Hex,
  balance: process.env.REACT_APP_TOKEN_BALANCE_ADDRESS as Hex,
  // balance: process.env.REACT_APP_TOKEN_BALANCE_ADDRESS as Hex,
};
