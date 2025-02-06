const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;
const GEAR_EXE_NODE_ADDRESS = import.meta.env.VITE_GEAR_EXE_NODE_ADDRESS as string;
const ETH_CHAIN_ID = 17000; // (0x4268) Holesky
const ETH_NODE_ADDRESS = import.meta.env.VITE_ETH_NODE_ADDRESS;

const DIGIT_RECOGNITION_CONTRACT_ADDRESS = import.meta.env.VITE_DIGIT_RECOGNITION_CONTRACT_ADDRESS as `0x${string}`;

enum LocalStorage {
  Node = 'node',
}

const NODE_ADRESS_URL_PARAM = 'node';

export {
  PROJECT_ID,
  GEAR_EXE_NODE_ADDRESS,
  ETH_CHAIN_ID,
  ETH_NODE_ADDRESS,
  DIGIT_RECOGNITION_CONTRACT_ADDRESS,
  LocalStorage,
  NODE_ADRESS_URL_PARAM,
};
