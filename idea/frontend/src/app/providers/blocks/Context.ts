import { createContext } from 'react';

import { IChainBlock } from '@/entities/chainBlock';

const BlocksContext = createContext<IChainBlock[]>([]);

export { BlocksContext };
