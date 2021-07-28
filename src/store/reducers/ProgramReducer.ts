import { SOCKET_RESULT_STATUSES } from 'consts';
import { ProgramState, ProgramAction, ProgramActionTypes } from '../../types/program';

const initialState: ProgramState = {
  programs: null,
  isProgramUploading: false,
  isMessageSending: false,
  programUploadingStatus: null,
  messageSendingStatus: null,
  loading: false,
  error: null,
  programUploadingError: null,
  messageSendingError: null,
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
      return { ...state, isProgramUploading: true, programUploadingError: null, programUploadingStatus: null }

    case ProgramActionTypes.PROGRAM_UPLOAD_SUCCESS:
      return { ...state, isProgramUploading: false, programUploadingError: null, programUploadingStatus: null }

    case ProgramActionTypes.PROGRAM_UPLOAD_FAILED:
      return { ...state, isProgramUploading: false, programUploadingError: action.payload, programUploadingStatus: null }

    case ProgramActionTypes.PROGRAM_UPLOAD_STATUS:
      return { ...state, isProgramUploading: true, programUploadingError: null, programUploadingStatus: action.payload }

    case ProgramActionTypes.PROGRAM_UPLOAD_RESET:
      return { ...state, isProgramUploading: false, programUploadingError: null, programUploadingStatus: null }

    case ProgramActionTypes.SEND_MESSAGE_START:
      return { ...state, isMessageSending: true, messageSendingError: null, messageSendingStatus: null }

    case ProgramActionTypes.SEND_MESSAGE_SUCCESS:
      return { ...state, isMessageSending: false, messageSendingError: null, messageSendingStatus: SOCKET_RESULT_STATUSES.SUCCESS }

    case ProgramActionTypes.SEND_MESSAGE_STATUS:
      return { ...state, isMessageSending: false, messageSendingError: null, messageSendingStatus: action.payload }

    case ProgramActionTypes.SEND_MESSAGE_FAILED:
      return { ...state, isMessageSending: false, messageSendingError: action.payload, messageSendingStatus: null }

    case ProgramActionTypes.SEND_MESSAGE_RESET:
      return { ...state, isMessageSending: false, messageSendingError: null, messageSendingStatus: null }
  
    case ProgramActionTypes.RESET_PROGRAMS:
      return { ...initialState };

    default:
      return state;
  }
};

export default ProgramReducer;
