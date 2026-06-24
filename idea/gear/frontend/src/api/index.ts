import type { NodeSection } from '@/entities/node';
// import { NODES_API_URL } from '@/shared/config';

import { INFINITE_QUERY } from './consts';
import type { PaginationParameters, PaginationResponse } from './types';

// ! TODO: remove this hack
// const getNodes = () => fetch(NODES_API_URL).then((result) => result.json() as unknown as NodeSection[]);
const getNodes = () =>
  Promise.resolve([
    {
      caption: 'Vara Network Testnet',
      nodes: [
        { isCustom: false, address: 'wss://testnet.vara.network', icon: 'vara' },
        { isCustom: false, address: 'wss://archive-testnet.vara.network', icon: 'vara' },
      ],
    },
    { caption: 'development', nodes: [{ isCustom: false, address: 'ws://localhost:9944' }] },
  ] as NodeSection[]);

export type { PaginationParameters, PaginationResponse };
export { getNodes, INFINITE_QUERY };
