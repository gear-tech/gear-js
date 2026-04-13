import { createContext } from 'react';

import type { IdeaEvent } from '@/features/explorer';

const EventsContext = createContext<IdeaEvent[] | undefined>(undefined);

export { EventsContext };
