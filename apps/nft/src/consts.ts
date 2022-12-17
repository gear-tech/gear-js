import { Hex } from '@gear-js/api';

export const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  IPFS: process.env.REACT_APP_IPFS_ADDRESS as string,
  IPFS_GATEWAY: process.env.REACT_APP_IPFS_GATEWAY_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
  NFT_CONTRACT_ADDRESS: process.env.REACT_APP_NFT_CONTRACT_ADDRESS as Hex,
};

export const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export const FILTERS = ['All', 'My']; // , 'Approved'

