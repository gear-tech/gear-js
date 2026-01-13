import { Hex } from 'viem';

const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;
const VARA_ETH_NODE_ADDRESS = import.meta.env.VITE_VARA_ETH_NODE_ADDRESS as `ws://${string}`;
const ETH_CHAIN_ID = Number(import.meta.env.VITE_ETH_CHAIN_ID);
const ETH_NODE_ADDRESS = import.meta.env.VITE_ETH_NODE_ADDRESS as string;
const EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL as string;

const ROUTER_CONTRACT_ADDRESS = import.meta.env.VITE_ROUTER_CONTRACT_ADDRESS as Hex;

console.log('envs', {
  PROJECT_ID,
  VARA_ETH_NODE_ADDRESS,
  ETH_CHAIN_ID,
  ETH_NODE_ADDRESS,
  EXPLORER_URL,
  ROUTER_CONTRACT_ADDRESS,
});

export { PROJECT_ID, VARA_ETH_NODE_ADDRESS, ETH_CHAIN_ID, ETH_NODE_ADDRESS, EXPLORER_URL, ROUTER_CONTRACT_ADDRESS };
