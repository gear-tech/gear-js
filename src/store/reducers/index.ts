import { combineReducers } from "redux";
import ProgramReducer from "./ProgramReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    user: userReducer,
    programs: ProgramReducer
});

export type RootState = ReturnType<typeof rootReducer>

export { rootReducer };