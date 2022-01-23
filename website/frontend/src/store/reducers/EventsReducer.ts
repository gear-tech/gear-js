import { EventsAction, EventsActionTypes, EventsState } from 'types/events-list';

const initState: EventsState = {
  list: [],
};

const EventsReducer = (state = initState, action: EventsAction) => {
  const { type, payload } = action;

  switch (type) {
    case EventsActionTypes.ADD_EVENTS:
      const list = [...payload, ...state.list];
      return { ...state, list };

    default:
      return state;
  }
};

export default EventsReducer;
