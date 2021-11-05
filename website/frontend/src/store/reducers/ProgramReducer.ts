import { ProgramState, ProgramAction, ProgramActionTypes } from '../../types/program';

const initialState: ProgramState = {
  programs: null,
  programsCount: null,
  allUploadedPrograms: null,
  allUploadedProgramsCount: null,

  isProgramUploading: false,
  isMetaUploading: false,
  isMessageSending: false,

  programStatus: null,
  payloadType: null,

  gas: null,

  loading: false,

  error: null,
  programUploadingError: null,
  metaUploadingError: null,
  messageSendingError: null,
};

const ProgramReducer = (state = initialState, action: ProgramAction): ProgramState => {
  switch (action.type) {
    case ProgramActionTypes.FETCH_GAS:
      return { ...state, gas: action.payload };

    case ProgramActionTypes.RESET_GAS:
      return { ...state, gas: null };
    case ProgramActionTypes.FETCH_USER_PROGRAMS:
      return { ...state, loading: true, error: null };

    case ProgramActionTypes.FETCH_USER_PROGRAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        programs: action.payload.programs,
        programsCount: action.payload.count,
      };

    case ProgramActionTypes.FETCH_ALL_PROGRAMS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        allUploadedPrograms: action.payload.programs,
        allUploadedProgramsCount: action.payload.count,
      };

    case ProgramActionTypes.FETCH_USER_PROGRAMS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        programs: null,
        programsCount: null,
        allUploadedPrograms: null,
        allUploadedProgramsCount: null,
      };

    case ProgramActionTypes.FETCH_PROGRAM:
      return { ...state, loading: true, error: null };

    case ProgramActionTypes.FETCH_PROGRAM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        programs:
          state.programs &&
          state.programs.map((program) => {
            if (program.id === action.payload.id) {
              return action.payload;
            }
            return program;
          }),
      };

    case ProgramActionTypes.FETCH_PROGRAM_ERROR:
      return { ...state, loading: false, error: action.payload, programs: null };

    case ProgramActionTypes.PROGRAM_UPLOAD_START:
      return { ...state, isProgramUploading: true, programUploadingError: null, programStatus: null };

    case ProgramActionTypes.PROGRAM_UPLOAD_SUCCESS:
      return { ...state, isProgramUploading: false, programUploadingError: null, programStatus: null };

    case ProgramActionTypes.PROGRAM_UPLOAD_FAILED:
      return { ...state, isProgramUploading: false, programUploadingError: action.payload, programStatus: null };

    case ProgramActionTypes.META_UPLOAD_START:
      return { ...state, isMetaUploading: true, metaUploadingError: null, programStatus: null };

    case ProgramActionTypes.META_UPLOAD_SUCCESS:
      return { ...state, isMetaUploading: false, metaUploadingError: null, programStatus: null };

    case ProgramActionTypes.META_UPLOAD_FAILED:
      return { ...state, isMetaUploading: false, metaUploadingError: action.payload, programStatus: null };

    case ProgramActionTypes.META_UPLOAD_RESET:
      return { ...state, isMetaUploading: false, metaUploadingError: null, programStatus: null };

    case ProgramActionTypes.PROGRAM_STATUS:
      return { ...state, programStatus: action.payload };

    case ProgramActionTypes.FETCH_PROGRAM_PAYLOAD_TYPE:
      return { ...state, payloadType: action.payload };

    case ProgramActionTypes.PROGRAM_UPLOAD_RESET:
      return { ...state, isProgramUploading: false, programUploadingError: null, programStatus: null };

    case ProgramActionTypes.SEND_MESSAGE_START:
      return { ...state, isMessageSending: true, messageSendingError: null, programStatus: null };

    case ProgramActionTypes.SEND_MESSAGE_SUCCESS:
      return { ...state, isMessageSending: false, messageSendingError: null, programStatus: null };

    case ProgramActionTypes.SEND_MESSAGE_FAILED:
      return { ...state, isMessageSending: false, messageSendingError: action.payload, programStatus: null };

    case ProgramActionTypes.SEND_MESSAGE_RESET:
      return { ...state, isMessageSending: false, messageSendingError: null, programStatus: null };

    case ProgramActionTypes.RESET_PROGRAM_PAYLOAD_TYPE:
      return { ...state, payloadType: null };

    case ProgramActionTypes.RESET_PROGRAMS:
      return { ...initialState };

    default:
      return state;
  }
};

export default ProgramReducer;
