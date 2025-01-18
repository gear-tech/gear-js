import { createContext } from 'react';

import { RecentBlock } from '@/features/recentBlocks';

const BlocksContext = createContext<RecentBlock[]>([]);

export { BlocksContext };
