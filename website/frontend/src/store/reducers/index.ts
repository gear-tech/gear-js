import { combineReducers } from "redux";
import BlockReducer from "./BlocksReducer";
import ProgramReducer from "./ProgramReducer";
import userReducer from "./userReducer";
import NotificationReducer from "./NotificationReducer";

const rootReducer = combineReducers({
    user: userReducer,
    programs: ProgramReducer,
    blocks: BlockReducer, 
    notifications: NotificationReducer
});

export type RootState = ReturnType<typeof rootReducer>

export { rootReducer };