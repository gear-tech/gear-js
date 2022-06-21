import { Hex } from '@gear-js/api';

const NODE_ADDRESS = process.env.REACT_APP_NODE_ADDRESS as string;
const IPFS_ADDRESS = process.env.REACT_APP_IPFS_ADDRESS as string;
const IPFS_GATEWAY_ADDRESS = process.env.REACT_APP_IPFS_GATEWAY_ADDRESS as string;
const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_MARKETPLACE_NFT_CONTRACT_ADDRESS as Hex;
const MARKETPLACE_CONTRACT_ADDRESS = process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS as Hex;

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export {
  NODE_ADDRESS,
  IPFS_ADDRESS,
  IPFS_GATEWAY_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  MARKETPLACE_CONTRACT_ADDRESS,
  LOCAL_STORAGE,
};
