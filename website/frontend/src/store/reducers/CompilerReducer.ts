import { CompilerState, CompilerAction, CompilerActionTypes } from 'types/compiler';

const initialState: CompilerState = {
  isBuildDone: false,
};

const CompilerReducer = (state = initialState, action: CompilerAction): CompilerState => {
  switch (action.type) {
    case CompilerActionTypes.SET_IS_BUILD_DONE:
      return { ...state, isBuildDone: action.payload };

    default:
      return state;
  }
};

export default CompilerReducer;
