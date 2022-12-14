import { Hex } from "@gear-js/api";

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
};
const CONTRACT = {
  CONTRACT_ID:process.env.REACT_APP_DNS_CONTRACT as Hex,
}
const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

export { ADDRESS, LOCAL_STORAGE, CONTRACT };
