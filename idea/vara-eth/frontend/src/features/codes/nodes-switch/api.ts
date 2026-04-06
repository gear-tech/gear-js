import {
  ETH_CHAIN_ID_MAINNET,
  ETH_CHAIN_ID_TESTNET,
  ETH_NODE_ADDRESS_MAINNET,
  ETH_NODE_ADDRESS_TESTNET,
  EXPLORER_URL_MAINNET,
  EXPLORER_URL_TESTNET,
  ROUTER_CONTRACT_ADDRESS_MAINNET,
  ROUTER_CONTRACT_ADDRESS_TESTNET,
  VARA_ETH_NODE_ADDRESSES_MAINNET,
  VARA_ETH_NODE_ADDRESSES_TESTNET,
} from '@/shared/config';

import type { NodeSection } from './types';

const toNodes = (addresses: string[]) => addresses.map((address) => ({ address }));

const NODE_SECTIONS: NodeSection[] = [
  {
    caption: 'Vara.eth Mainnet',
    ethChainId: ETH_CHAIN_ID_MAINNET,
    ethNodeAddress: ETH_NODE_ADDRESS_MAINNET,
    explorerUrl: EXPLORER_URL_MAINNET,
    routerContractAddress: ROUTER_CONTRACT_ADDRESS_MAINNET,
    nodes: toNodes(VARA_ETH_NODE_ADDRESSES_MAINNET),
  },
  {
    caption: 'Vara.eth Testnet',
    ethChainId: ETH_CHAIN_ID_TESTNET,
    ethNodeAddress: ETH_NODE_ADDRESS_TESTNET,
    explorerUrl: EXPLORER_URL_TESTNET,
    routerContractAddress: ROUTER_CONTRACT_ADDRESS_TESTNET,
    nodes: toNodes(VARA_ETH_NODE_ADDRESSES_TESTNET),
  },
];

const getNodes = async (): Promise<NodeSection[]> => Promise.resolve(NODE_SECTIONS);

export { getNodes, NODE_SECTIONS };
