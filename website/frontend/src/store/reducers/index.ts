import { combineReducers } from 'redux';
import AccountReducer from './AccountReducer';
import BlockReducer from './BlocksReducer';
import ProgramReducer from './ProgramReducer';
import AlertReducer from './AlertReducer';
import CompilerReducer from './CompilerReducer';
import MessageReducer from './MessageReducer';

const rootReducer = combineReducers({
  programs: ProgramReducer,
  blocks: BlockReducer,
  alert: AlertReducer,
  account: AccountReducer,
  compiler: CompilerReducer,
  messages: MessageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
