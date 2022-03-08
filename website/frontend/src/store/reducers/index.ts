import { combineReducers } from 'redux';
import ProgramReducer from './ProgramReducer';
import AlertReducer from './AlertReducer';

const rootReducer = combineReducers({
  programs: ProgramReducer,
  alert: AlertReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
