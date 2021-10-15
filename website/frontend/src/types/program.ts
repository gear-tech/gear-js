export interface ProgramModel {
  hash: string;
  blockHash?: string;
  programNumber?: number;
  name?: string;
  callCount?: number;
  uploadedAt?: string;
}

export interface ProgramPaginationModel {
  count: number;
  programs: ProgramModel[];
}

export interface MetaModel {
  init_input: string;
  init_output: string;
  input: string;
  output: string;
  title: string;
  types: string;
  name?: string;
}

export interface UploadProgramModel {
  initPayload: string;
  gasLimit: number;
  value: number;
  init_input: string;
  init_output: string;
  input: string;
  output: string;
  hash?: string;
  types: string;
  title?: string;
}

export interface MessageModel {
  destination: string;
  gasLimit?: number;
  value: number;
  payload: string;
  additional?: any;
}

export interface ProgramsPagintaionModel {
  jsonrpc: string;
  id: string;
  result: ProgramPaginationModel;
}

export interface ProgramRPCModel {
  jsonrpc: string;
  id: string;
  result: ProgramModel;
}

export interface BalanceModel {
  value: number;
}

export interface SearchModel {
  searchQuery: string;
}

export interface ProgramState {
  programs: ProgramModel[] | null;
  programsCount: number | null;

  allUploadedPrograms: ProgramModel[] | null;
  allUploadedProgramsCount: number | null;

  isProgramUploading: boolean;
  isMetaUploading: boolean;
  isMessageSending: boolean;

  programStatus: null | string;
  payloadType: null | string;

  gas: null | number;

  loading: boolean;
  error: null | string;
  programUploadingError: null | string;
  metaUploadingError: null | string;
  messageSendingError: null | string;
}

export enum ProgramActionTypes {
  FETCH_USER_PROGRAMS = 'FETCH_USER_PROGRAMS',
  FETCH_ALL_PROGRAMS_SUCCESS = 'FETCH_PROGRAMS_SUCCESS',
  FETCH_USER_PROGRAMS_SUCCESS = 'FETCH_USER_PROGRAMS_SUCCESS',
  FETCH_USER_PROGRAMS_ERROR = 'FETCH_USER_PROGRAMS_ERROR',
  FETCH_PROGRAM = 'FETCH_PROGRAM',
  FETCH_PROGRAM_SUCCESS = 'FETCH_PROGRAM_SUCCESS',
  FETCH_PROGRAM_ERROR = 'FETCH_PROGRAM_ERROR',
  PROGRAM_UPLOAD_START = 'PROGRAM_UPLOAD_START',
  PROGRAM_UPLOAD_SUCCESS = 'PROGRAM_UPLOAD_SUCCESS',
  PROGRAM_UPLOAD_FAILED = 'PROGRAM_UPLOAD_FAILED',
  META_UPLOAD_START = 'META_UPLOAD_START',
  META_UPLOAD_SUCCESS = 'META_UPLOAD_SUCCESS',
  META_UPLOAD_FAILED = 'META_UPLOAD_FAILED',
  PROGRAM_STATUS = 'PROGRAM_STATUS',
  FETCH_PROGRAM_PAYLOAD_TYPE = 'FETCH_PROGRAM_PAYLOAD_TYPE',
  SEND_MESSAGE_START = 'SEND_MESSAGE_START',
  SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS',
  SEND_MESSAGE_FAILED = 'SEND_MESSAGE_FAILED',
  PROGRAM_UPLOAD_RESET = 'PROGRAM_UPLOAD_RESET',
  SEND_MESSAGE_RESET = 'SEND_MESSAGE_RESET',
  META_UPLOAD_RESET = 'META_UPLOAD_RESET',
  FETCH_GAS = 'FETCH_GAS',
  RESET_GAS = 'RESET_GAS',
  RESET_PROGRAM_PAYLOAD_TYPE = 'RESET_PROGRAM_PAYLOAD_TYPE',
  RESET_PROGRAMS = 'RESET_PROGRAMS',
}

interface FetchGasAction {
  type: ProgramActionTypes.FETCH_GAS;
  payload: number;
}

interface ResetGasAction {
  type: ProgramActionTypes.RESET_GAS;
}

interface SendMessageStartAction {
  type: ProgramActionTypes.SEND_MESSAGE_START;
}

interface SendMessageSuccessAction {
  type: ProgramActionTypes.SEND_MESSAGE_SUCCESS;
}

interface SendMessageFailedAction {
  type: ProgramActionTypes.SEND_MESSAGE_FAILED;
  payload: string;
}

interface UploadProgramStartAction {
  type: ProgramActionTypes.PROGRAM_UPLOAD_START;
}

interface UploadProgramSuccessAction {
  type: ProgramActionTypes.PROGRAM_UPLOAD_SUCCESS;
}

interface UploadProgramFailedAction {
  type: ProgramActionTypes.PROGRAM_UPLOAD_FAILED;
  payload: string;
}

interface UploadMetaStartAction {
  type: ProgramActionTypes.META_UPLOAD_START;
}

interface UploadMetaSuccessAction {
  type: ProgramActionTypes.META_UPLOAD_SUCCESS;
}

interface UploadMetaFailedAction {
  type: ProgramActionTypes.META_UPLOAD_FAILED;
  payload: string;
}

interface UploadProgramStatusAction {
  type: ProgramActionTypes.PROGRAM_STATUS;
  payload: string;
}

interface FetchProgramPayloadType {
  type: ProgramActionTypes.FETCH_PROGRAM_PAYLOAD_TYPE;
  payload: string;
}

interface FetchProgramsAction {
  type: ProgramActionTypes.FETCH_USER_PROGRAMS;
}
interface FetchAllProgramsSuccessAction {
  type: ProgramActionTypes.FETCH_ALL_PROGRAMS_SUCCESS;
  payload: ProgramPaginationModel;
}
interface FetchProgramsAllSuccessAction {
  type: ProgramActionTypes.FETCH_USER_PROGRAMS_SUCCESS;
  payload: ProgramPaginationModel;
}
interface FetchProgramsErrorAction {
  type: ProgramActionTypes.FETCH_USER_PROGRAMS_ERROR;
  payload: string;
}

interface FetchProgramAction {
  type: ProgramActionTypes.FETCH_PROGRAM;
}

interface FetchProgramSuccessAction {
  type: ProgramActionTypes.FETCH_PROGRAM_SUCCESS;
  payload: ProgramModel;
}

interface FetchProgramErrorAction {
  type: ProgramActionTypes.FETCH_PROGRAM_ERROR;
  payload: string;
}

interface SendMessageResetAction {
  type: ProgramActionTypes.SEND_MESSAGE_RESET;
}

interface UploadMetaResetAction {
  type: ProgramActionTypes.META_UPLOAD_RESET;
}

interface UploadProgramResetAction {
  type: ProgramActionTypes.PROGRAM_UPLOAD_RESET;
}

interface ResetProgramPayloadTypeAction {
  type: ProgramActionTypes.RESET_PROGRAM_PAYLOAD_TYPE;
}

interface ResetProgramsAction {
  type: ProgramActionTypes.RESET_PROGRAMS;
}

export type ProgramAction =
  | FetchGasAction
  | ResetGasAction
  | FetchProgramsAction
  | FetchProgramsErrorAction
  | FetchAllProgramsSuccessAction
  | FetchProgramAction
  | FetchProgramSuccessAction
  | FetchProgramsAllSuccessAction
  | FetchProgramErrorAction
  | UploadProgramStartAction
  | UploadProgramSuccessAction
  | UploadProgramFailedAction
  | UploadMetaStartAction
  | UploadMetaSuccessAction
  | UploadMetaFailedAction
  | UploadProgramStatusAction
  | FetchProgramPayloadType
  | UploadProgramResetAction
  | UploadMetaResetAction
  | SendMessageStartAction
  | SendMessageSuccessAction
  | SendMessageFailedAction
  | SendMessageResetAction
  | ResetProgramPayloadTypeAction
  | ResetProgramsAction;
