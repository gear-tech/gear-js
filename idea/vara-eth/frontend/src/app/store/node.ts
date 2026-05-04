import { atom } from 'jotai';
import type { Hex } from 'viem';

import { getInitialNode } from '@/features/codes/nodes-switch/config';

type NodeState = {
  varaEthNodeAddress: string;
  ethChainId: number;
  ethNodeAddress: string;
  explorerUrl: string;
  routerContractAddress: Hex;
};

const nodeAtom = atom<NodeState>(getInitialNode());

export { type NodeState, nodeAtom };
