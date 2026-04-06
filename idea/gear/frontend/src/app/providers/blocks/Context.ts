import { createContext } from 'react';

import type { RecentBlock } from '@/features/recentBlocks';

const BlocksContext = createContext<RecentBlock[]>([]);

export { BlocksContext };
