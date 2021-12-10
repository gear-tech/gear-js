import { combineReducers } from 'redux';
import ApiReducer from './ApiReduces';
import AccountReducer from './AccountReducer';
import BlockReducer from './BlocksReducer';
import ProgramReducer from './ProgramReducer';
import NotificationReducer from './NotificationReducer';
import AlertReducer from './AlertReducer';
import CompilerReducer from './CompilerReducer';

const rootReducer = combineReducers({
  programs: ProgramReducer,
  blocks: BlockReducer,
  notifications: NotificationReducer,
  alert: AlertReducer,
  api: ApiReducer,
  account: AccountReducer,
  compiler: CompilerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
