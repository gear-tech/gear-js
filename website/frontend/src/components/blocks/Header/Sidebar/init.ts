export const nodes = [
  {
    id: 1,
    caption: 'test network',
    nodes: [{ id: 1, custom: false, address: 'wss://rpc-node.gear-tech.io:443' }],
  },
  {
    id: 2,
    caption: 'development',
    nodes: [{ id: 2, custom: false, address: 'ws://localhost:9944' }],
  },
] as const;
