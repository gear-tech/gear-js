import type { Hex } from 'viem';

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

type SectionConfig = {
  caption: string;
  ethChainId: number;
  ethNodeAddress: string;
  explorerUrl: string;
  routerContractAddress: Hex;
  nodeAddresses: string[];
};

const createSection = ({
  ethChainId,
  ethNodeAddress,
  explorerUrl,
  routerContractAddress,
  nodeAddresses,
  ...rest
}: SectionConfig): NodeSection | undefined => {
  if (Number.isNaN(ethChainId) || !ethNodeAddress || !explorerUrl || !routerContractAddress || !nodeAddresses.length)
    return undefined;

  return {
    ...rest,
    ethChainId,
    ethNodeAddress,
    explorerUrl: `${explorerUrl}/api`,
    routerContractAddress,
    nodes: nodeAddresses.map((address) => ({ address })),
  };
};

const NODE_SECTIONS: NodeSection[] = [
  createSection({
    caption: 'Vara.eth Mainnet',
    ethChainId: ETH_CHAIN_ID_MAINNET,
    ethNodeAddress: ETH_NODE_ADDRESS_MAINNET,
    explorerUrl: EXPLORER_URL_MAINNET,
    routerContractAddress: ROUTER_CONTRACT_ADDRESS_MAINNET,
    nodeAddresses: VARA_ETH_NODE_ADDRESSES_MAINNET,
  }),
  createSection({
    caption: 'Vara.eth Testnet',
    ethChainId: ETH_CHAIN_ID_TESTNET,
    ethNodeAddress: ETH_NODE_ADDRESS_TESTNET,
    explorerUrl: EXPLORER_URL_TESTNET,
    routerContractAddress: ROUTER_CONTRACT_ADDRESS_TESTNET,
    nodeAddresses: VARA_ETH_NODE_ADDRESSES_TESTNET,
  }),
].filter((section): section is NodeSection => !!section);

export { NODE_SECTIONS };
