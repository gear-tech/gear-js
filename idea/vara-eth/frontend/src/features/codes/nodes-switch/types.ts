import type { Hex } from 'viem';

type Node = {
  address: string;
};

type NodeSection = {
  caption: string;
  ethChainId: number;
  ethNodeAddress: string;
  explorerUrl: string;
  routerContractAddress: Hex;
  nodes: Node[];
};

export type { Node, NodeSection };
