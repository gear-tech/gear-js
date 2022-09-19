const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  IPFS: process.env.REACT_APP_IPFS_ADDRESS as string,
  IPFS_GATEWAY: process.env.REACT_APP_IPFS_GATEWAY_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};
export { ADDRESS, LOCAL_STORAGE };
