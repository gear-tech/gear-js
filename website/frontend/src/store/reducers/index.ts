import { combineReducers } from 'redux';
import ApiReducer from './ApiReduces';
import BlockReducer from './BlocksReducer';
import ProgramReducer from './ProgramReducer';
import userReducer from './userReducer';
import NotificationReducer from './NotificationReducer';
import AlertReducer from './AlertReducer';

const rootReducer = combineReducers({
  user: userReducer,
  programs: ProgramReducer,
  blocks: BlockReducer,
  notifications: NotificationReducer,
  alert: AlertReducer,
  api: ApiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
