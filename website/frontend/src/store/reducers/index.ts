import { combineReducers } from 'redux';
import ProgramReducer from './ProgramReducer';
import AlertReducer from './AlertReducer';
import CompilerReducer from './CompilerReducer';

const rootReducer = combineReducers({
  programs: ProgramReducer,
  alert: AlertReducer,
  compiler: CompilerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
