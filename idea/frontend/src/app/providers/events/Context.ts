import { createContext } from 'react';

import { IdeaEvent } from 'features/explorer';

const EventsContext = createContext<IdeaEvent[] | undefined>(undefined);

export { EventsContext };
