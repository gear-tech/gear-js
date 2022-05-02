import { DEFAULT_NODES_URL } from 'consts';
import { rest } from 'msw';

const sidebarNodes = [
  {
    caption: 'testnet heading',
    nodes: [{ address: 'testnet-address' }, { address: 'random-testnet-address' }],
  },
  { caption: 'development', nodes: [{ address: 'dev-address', isCustom: false }] },
];

const handlers = [
  rest.get(DEFAULT_NODES_URL, (_req, res, ctx) => {
    return res(ctx.json(sidebarNodes));
  }),
];

export { handlers };
