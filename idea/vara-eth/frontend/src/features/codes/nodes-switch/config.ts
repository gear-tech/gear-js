import type { Hex } from 'viem';

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

const DEFAULT_NODE_SECTION = NODE_SECTIONS[0];
const DEFAULT_NODE_ADDRESS = DEFAULT_NODE_SECTION?.nodes[0]?.address ?? '';

const getSectionByNodeAddress = (address: string): NodeSection =>
  NODE_SECTIONS.find((section) => section.nodes.some((node) => node.address === address)) ?? DEFAULT_NODE_SECTION;

const getInitialNodeAddress = () =>
  getNodeAddressFromUrl() || localStorage.getItem(LocalStorage.Node) || DEFAULT_NODE_ADDRESS;

const getInitialNode = (): InitialNode => {
  const address = getInitialNodeAddress();
  const matched = NODE_SECTIONS.find((s) => s.nodes.some((node) => node.address === address));
  const section = matched ?? DEFAULT_NODE_SECTION;

  if (!section) throw new Error('No node sections configured. Check environment variables.');

  return {
    varaEthNodeAddress: matched ? address : section.nodes[0].address,
    ethChainId: section.ethChainId,
    ethNodeAddress: section.ethNodeAddress,
    explorerUrl: section.explorerUrl,
    routerContractAddress: section.routerContractAddress,
  };
};

export { getInitialNode, getSectionByNodeAddress, type InitialNode, LocalStorage, NODE_ADRESS_URL_PARAM };
