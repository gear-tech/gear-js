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

export { nodeSections, LocalStorage, NODE_ADRESS_URL_PARAM };
