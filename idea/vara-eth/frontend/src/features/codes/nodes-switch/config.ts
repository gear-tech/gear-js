import type { Hex } from 'viem';

import {
  ETH_CHAIN_ID_TESTNET,
  ETH_NODE_ADDRESS_TESTNET,
  EXPLORER_URL_TESTNET,
  ROUTER_CONTRACT_ADDRESS_TESTNET,
  VARA_ETH_NODE_ADDRESSES_TESTNET,
} from '@/shared/config';

import { NODE_SECTIONS } from './api';
import type { NodeSection } from './types';
import { getNodeAddressFromUrl } from './utils';

type InitialNode = {
  varaEthNodeAddress: string;
  ethChainId: number;
  ethNodeAddress: string;
  explorerUrl: string;
  routerContractAddress: Hex;
};

const LocalStorage = {
  Node: 'node',
} as const;

const NODE_ADRESS_URL_PARAM = 'node';
const DEFAULT_TESTNET_NODE_ADDRESS = VARA_ETH_NODE_ADDRESSES_TESTNET[0] ?? '';

const DEFAULT_NODE_SECTION: NodeSection = {
  caption: 'Default',
  ethChainId: ETH_CHAIN_ID_TESTNET,
  ethNodeAddress: ETH_NODE_ADDRESS_TESTNET,
  explorerUrl: EXPLORER_URL_TESTNET,
  routerContractAddress: ROUTER_CONTRACT_ADDRESS_TESTNET,
  nodes: DEFAULT_TESTNET_NODE_ADDRESS ? [{ address: DEFAULT_TESTNET_NODE_ADDRESS }] : [],
};

const getSectionByNodeAddress = (address: string): NodeSection =>
  NODE_SECTIONS.find((section) => section.nodes.some((node) => node.address === address)) ?? DEFAULT_NODE_SECTION;

const getInitialNodeAddress = () =>
  getNodeAddressFromUrl() || localStorage.getItem(LocalStorage.Node) || DEFAULT_TESTNET_NODE_ADDRESS;

const getInitialNode = (): InitialNode => {
  const varaEthNodeAddress = getInitialNodeAddress();
  const section = getSectionByNodeAddress(varaEthNodeAddress);

  return {
    varaEthNodeAddress,
    ethChainId: section.ethChainId,
    ethNodeAddress: section.ethNodeAddress,
    explorerUrl: section.explorerUrl,
    routerContractAddress: section.routerContractAddress,
  };
};

export { getInitialNode, getSectionByNodeAddress, type InitialNode, LocalStorage, NODE_ADRESS_URL_PARAM };
