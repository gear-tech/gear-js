import { useContext } from 'react';
import { EventsContext } from 'app/providers/events';

const useEvents = () => useContext(EventsContext);

export { useEvents };
