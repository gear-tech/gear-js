import { ProgramState, ProgramAction, ProgramActionTypes } from '../../types/program';

const initialState: ProgramState = {
  programs: null,
  loading: false,
  error: null,
};

const ProgramReducer = (state = initialState, action: ProgramAction): ProgramState => {
  switch (action.type) {
    case ProgramActionTypes.FETCH_PROGRAMS:
      return { ...state, loading: true, error: null };

    case ProgramActionTypes.FETCH_PROGRAMS_SUCCESS:
      return { ...state, loading: false, error: null, programs: action.payload };

    case ProgramActionTypes.FETCH_PROGRAMS_ERROR:
      return { ...state, loading: false, error: action.payload, programs: null };

    case ProgramActionTypes.FETCH_PROGRAM:
      return { ...state, loading: true, error: null };

    case ProgramActionTypes.FETCH_PROGRAM_SUCCESS:
      return { 
        ...state,
        loading: false,
        error: null,
        programs: state.programs && state.programs.map((program) => {
          if (program.hash === action.payload.hash) {
            return action.payload
          }
          return program;
        })
      };

    case ProgramActionTypes.FETCH_PROGRAM_ERROR:
      return { ...state, loading: false, error: action.payload, programs: null };
    
    case ProgramActionTypes.RESET_PROGRAMS:
      return { ...initialState };

    default:
      return state;
  }
};

export default ProgramReducer;
