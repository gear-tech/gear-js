import { HexString } from 'gearexe';

const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;
const GEAR_EXE_NODE_ADDRESS = import.meta.env.VITE_GEAR_EXE_NODE_ADDRESS as `https://${string}`;
const ETH_CHAIN_ID = 17000; // (0x4268) Holesky
const ETH_NODE_ADDRESS = import.meta.env.VITE_ETH_NODE_ADDRESS as string;

const ROUTER_CONTRACT_ADDRESS = import.meta.env.VITE_ROUTER_CONTRACT_ADDRESS as HexString;
const WVARA_CONTRACT_ADDRESS = import.meta.env.VITE_WVARA_CONTRACT_ADDRESS as HexString;
const MIRROR_CONTRACT_ADDRESS = import.meta.env.VITE_MIRROR_CONTRACT_ADDRESS as HexString;

export {
  PROJECT_ID,
  GEAR_EXE_NODE_ADDRESS,
  ETH_CHAIN_ID,
  ETH_NODE_ADDRESS,
  ROUTER_CONTRACT_ADDRESS,
  WVARA_CONTRACT_ADDRESS,
  MIRROR_CONTRACT_ADDRESS,
};
