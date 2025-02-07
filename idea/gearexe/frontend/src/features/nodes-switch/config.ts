import { GEAR_EXE_NODE_ADDRESS } from '@/shared/config';
import { getNodeAddressFromUrl } from './utils';

const nodeSections = [
  {
    caption: 'Gear.EXE',
    nodes: [{ address: 'ws://rpc.gear.exe' }, { address: 'ws://archive-rpc.gear.exe' }],
  },
  {
    caption: 'Gear.EXE Testnet',
    nodes: [{ address: 'ws://testnet.gear.exe' }, { address: 'ws://testnet-archive.gear.exe' }],
  },
];

const LocalStorage = {
  Node: 'node',
} as const;

const NODE_ADRESS_URL_PARAM = 'node';

const INITIAL_ENDPOINT =
  getNodeAddressFromUrl() || (localStorage[LocalStorage.Node] as string | null) || GEAR_EXE_NODE_ADDRESS;

export { nodeSections, LocalStorage, NODE_ADRESS_URL_PARAM, INITIAL_ENDPOINT };
