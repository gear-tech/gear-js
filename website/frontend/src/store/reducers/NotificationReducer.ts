import { NotificationState, NotificationActionTypes, NotificationAction } from 'types/notification';

const initialState: NotificationState = {
  notifications: null,
  recent: [],
  countUnread: null,
  count: null,
  loading: false,
  error: null,
};

const NotificationReducer = (state = initialState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case NotificationActionTypes.FETCH_NOTIFICATIONS:
      return { ...state, loading: true, error: null };

    case NotificationActionTypes.FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: state.notifications ? [action.payload, ...state.notifications] : [action.payload],
      };

    case NotificationActionTypes.FETCH_NOTIFICATIONS_ERROR:
      return { ...state, loading: false, error: action.payload, notifications: null };

    case NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT:
      return { ...state, loading: true, error: null };

    case NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT_SUCCESS:
      return { ...state, loading: true, error: null, countUnread: action.payload };

    case NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT_ERROR:
      return { ...state, loading: false, error: action.payload, notifications: null };

    case NotificationActionTypes.MARK_AS_READ_RECENT:
      return { ...state, recent: [...state.recent.filter((item) => action.payload.indexOf(item.id) === -1)] };

    case NotificationActionTypes.FETCH_RECENT_NOTIFICATION:
      if (!state.recent.find((item) => item.id === action.payload.id)) {
        return { ...state, recent: [action.payload, ...state.recent] };
      }
      return { ...state };

    case NotificationActionTypes.MARK_AS_READ_ALL_RECENT:
      return { ...state, recent: [] };

    case NotificationActionTypes.MARK_AS_READ_CERTAIN_RECENT:
      return { ...state, recent: [...state.recent.filter((item) => !action.payload.includes(item.id))] };

    default:
      return state;
  }
};

export default NotificationReducer;
