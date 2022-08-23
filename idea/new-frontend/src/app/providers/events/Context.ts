import { createContext } from 'react';

import { IdeaEvents } from 'shared/types/explorer';

const EventsContext = createContext<IdeaEvents>([]);

export { EventsContext };
