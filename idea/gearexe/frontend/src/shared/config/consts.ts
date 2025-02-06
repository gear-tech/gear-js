export const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;
export const GEAR_EXE_NODE_ADDRESS = import.meta.env.VITE_GEAR_EXE_NODE_ADDRESS as string;
export const ETH_CHAIN_ID = 17000; // (0x4268) Holesky
export const ETH_NODE_ADDRESS = import.meta.env.VITE_ETH_NODE_ADDRESS;

export const DIGIT_RECOGNITION_CONTRACT_ADDRESS = import.meta.env
  .VITE_DIGIT_RECOGNITION_CONTRACT_ADDRESS as `0x${string}`;

enum AnimationTimeout {
  Tiny = 50,
  Small = 150,
  Default = 250,
  Medium = 400,
  Big = 1000,
}

enum LocalStorage {
  Node = 'node',
}

const NODE_ADRESS_URL_PARAM = 'node';

export { AnimationTimeout, LocalStorage, NODE_ADRESS_URL_PARAM };
