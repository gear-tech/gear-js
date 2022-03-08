import { combineReducers } from 'redux';
import ProgramReducer from './ProgramReducer';

const rootReducer = combineReducers({
  programs: ProgramReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export { rootReducer };
