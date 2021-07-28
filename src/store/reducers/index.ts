import { combineReducers } from "redux";
import BlockReducer from "./BlocksReducer";
import ProgramReducer from "./ProgramReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    user: userReducer,
    programs: ProgramReducer,
    blocks: BlockReducer
});

export type RootState = ReturnType<typeof rootReducer>

export { rootReducer };