import { HexString } from '@polkadot/util/types';

export const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
};

export const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export const createTamagotchiInitial = {
  programId: '' as HexString,
  programId2: '' as HexString,
  currentStep: 1,
};

export const ENV = {
  store: process.env.REACT_APP_STORE_ADDRESS as HexString,
  balance: process.env.REACT_APP_TOKEN_BALANCE_ADDRESS as HexString,
  battle: process.env.REACT_APP_BATTLE_ADDRESS as HexString,
};

export const MULTIPLIER = {
  MILLISECONDS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
};
