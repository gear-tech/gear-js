import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  AUCTION_CONTRACT: process.env.REACT_APP_AUCTION_CONTRACT_ADDRESS as Hex,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export { ADDRESS, LOCAL_STORAGE };
