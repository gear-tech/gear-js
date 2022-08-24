import { createContext } from 'react';

import { ChainBlock } from 'entities/chainBlock';

const BlocksContext = createContext<ChainBlock[]>([]);

export { BlocksContext };
