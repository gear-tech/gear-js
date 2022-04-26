import { Hex } from '@gear-js/api';

const NODE_ADDRESS = process.env.REACT_APP_NODE_ADDRESS;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS as Hex;

export { NODE_ADDRESS, CONTRACT_ADDRESS };
