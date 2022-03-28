import { createContext } from 'react';
import { Blocks } from './types';

const BlocksContext = createContext<Blocks>([]);

export { BlocksContext };
