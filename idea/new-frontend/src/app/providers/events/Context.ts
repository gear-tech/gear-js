import { createContext } from 'react';

import { IdeaEvent } from 'entities/explorer';

const EventsContext = createContext<IdeaEvent[] | undefined>(undefined);

export { EventsContext };
