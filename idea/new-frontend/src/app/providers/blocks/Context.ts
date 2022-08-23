import { createContext } from 'react';

import { ChainBlock } from 'shared/types/chainBlock';

const BlocksContext = createContext<ChainBlock[]>([]);

export { BlocksContext };
