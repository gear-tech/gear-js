import type { Hex } from 'viem';

const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string;

const parseOptionalChainId = (value: string | undefined, fallbackValue: number): number => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return fallbackValue;
  }

  const chainId = Number(normalizedValue);

  if (!Number.isInteger(chainId) || chainId <= 0) {
    throw new Error(`ETH chain ID must be a positive integer. Received: "${value}"`);
  }

  return chainId;
};

const ETH_CHAIN_ID_TESTNET = parseOptionalChainId(import.meta.env.VITE_ETH_CHAIN_ID_TESTNET, 560048);
const ETH_CHAIN_ID_MAINNET = parseOptionalChainId(import.meta.env.VITE_ETH_CHAIN_ID_MAINNET, 1);

const ETH_NODE_ADDRESS_TESTNET = import.meta.env.VITE_ETH_NODE_ADDRESS_TESTNET as string;
const ETH_NODE_ADDRESS_MAINNET = import.meta.env.VITE_ETH_NODE_ADDRESS_MAINNET as string;

const parseSemicolonList = (value: string | undefined): string[] => (value ? value.split(';').filter(Boolean) : []);

const VARA_ETH_NODE_ADDRESSES_TESTNET = parseSemicolonList(import.meta.env.VITE_VARA_ETH_NODE_ADDRESSES_TESTNET);
const VARA_ETH_NODE_ADDRESSES_MAINNET = parseSemicolonList(import.meta.env.VITE_VARA_ETH_NODE_ADDRESSES_MAINNET);

const EXPLORER_URL_TESTNET = import.meta.env.VITE_EXPLORER_URL_TESTNET as string;
const EXPLORER_URL_MAINNET = import.meta.env.VITE_EXPLORER_URL_MAINNET as string;
const METADATA_STORAGE_API_URL = import.meta.env.VITE_METADATA_STORAGE_API_URL as string;

const ROUTER_CONTRACT_ADDRESS_TESTNET = import.meta.env.VITE_ROUTER_CONTRACT_ADDRESS_TESTNET as Hex;
const ROUTER_CONTRACT_ADDRESS_MAINNET = import.meta.env.VITE_ROUTER_CONTRACT_ADDRESS_MAINNET as Hex;

console.log('envs', {
  PROJECT_ID,
  VARA_ETH_NODE_ADDRESSES_TESTNET,
  VARA_ETH_NODE_ADDRESSES_MAINNET,
  ETH_CHAIN_ID_TESTNET,
  ETH_CHAIN_ID_MAINNET,
  ETH_NODE_ADDRESS_TESTNET,
  ETH_NODE_ADDRESS_MAINNET,
  EXPLORER_URL_TESTNET,
  EXPLORER_URL_MAINNET,
  ROUTER_CONTRACT_ADDRESS_TESTNET,
  ROUTER_CONTRACT_ADDRESS_MAINNET,
});

export {
  ETH_CHAIN_ID_MAINNET,
  ETH_CHAIN_ID_TESTNET,
  ETH_NODE_ADDRESS_MAINNET,
  ETH_NODE_ADDRESS_TESTNET,
  EXPLORER_URL_MAINNET,
  EXPLORER_URL_TESTNET,
  METADATA_STORAGE_API_URL,
  PROJECT_ID,
  ROUTER_CONTRACT_ADDRESS_MAINNET,
  ROUTER_CONTRACT_ADDRESS_TESTNET,
  VARA_ETH_NODE_ADDRESSES_MAINNET,
  VARA_ETH_NODE_ADDRESSES_TESTNET,
};
