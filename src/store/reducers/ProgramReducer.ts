import { ProgramState, ProgramAction, ProgramActionTypes } from '../../types/program';

const initialState: ProgramState = {
  programs: null,
  isProgramUploading: false,
  programUploadingStatus: null,
  loading: false,
  error: null,
  programUploadingError: null,
};

const ProgramReducer = (state = initialState, action: ProgramAction): ProgramState => {
  switch (action.type) {
    case ProgramActionTypes.FETCH_PROGRAMS:
      return { ...state, loading: true, error: null };

    case ProgramActionTypes.FETCH_PROGRAMS_SUCCESS:
      return { ...state, loading: false, error: null, programs: action.payload.reverse() };

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

    case ProgramActionTypes.PROGRAM_UPLOAD_START:
      return { ...state, isProgramUploading: true, programUploadingError: null }

    case ProgramActionTypes.PROGRAM_UPLOAD_SUCCESS:
      return { ...state, isProgramUploading: false, programUploadingError: null }

    case ProgramActionTypes.PROGRAM_UPLOAD_FAILED:
      return { ...state, isProgramUploading: false, programUploadingError: action.payload, programUploadingStatus: null }

    case ProgramActionTypes.PROGRAM_UPLOAD_IN_BLOCK:
      return { ...state, isProgramUploading: true, programUploadingError: null, programUploadingStatus: "in block" }

    case ProgramActionTypes.PROGRAM_UPLOAD_FINALIZED:
      return { ...state, isProgramUploading: true, programUploadingError: null, programUploadingStatus: "finalized" }

    case ProgramActionTypes.PROGRAM_UPLOAD_INITIALIZED:
      return { ...state, isProgramUploading: true, programUploadingError: null, programUploadingStatus: "program initialized" }
    
    case ProgramActionTypes.RESET_PROGRAMS:
      return { ...initialState };

    default:
      return state;
  }
};

export default ProgramReducer;
