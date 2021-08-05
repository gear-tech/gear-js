export interface ProgramModel {
    hash: string;
    blockHash: string;
    programNumber: number;
    name: string;
    callCount: number;
    uploadedAt: string;
}

export interface UploadedProgramModel {
    hash: string;
}

export interface ProgramPaginationModel {
    next: string;
    prev: string;
    count: string;
    result: UploadedProgramModel[];
}


export interface MessageStatusModel {
    status: string;
    blockHash: string;
    data: string;
}

export interface ProgramState {
    programs: ProgramModel[] | null;
    allUploadedPrograms: UploadedProgramModel[] | null;
    uploadedProgramsCount: number;
    isProgramUploading: boolean;
    isMessageSending: boolean;
    programUploadingStatus: null | string;
    messageSendingStatus: null | MessageStatusModel | string;
    loading: boolean;
    error: null | string;
    programUploadingError: null | string;
    messageSendingError: null | string;
}

export interface UploadProgramModel {
    initPayload: string;
    gasLimit: number;
    value: number;
}

export interface MessageModel {
    destination: string;
    gasLimit: number;
    value: number;
    payload: string;
}

export interface ProgramsInterface {
    jsonrpc: string,
    id: string,
    result: ProgramModel[]
}

export interface ProgramsListInterface {
    jsonrpc: string,
    id: string,
    result: ProgramPaginationModel
}

export interface ProgramInterface {
    jsonrpc: string,
    id: string,
    result: ProgramModel
}

export interface BalanceModel {
    value: number;
}

export interface SearchModel {
    programHash: string;
}

export enum ProgramActionTypes{
    FETCH_PROGRAMS = 'FETCH_PROGRAMS',
    FETCH_PROGRAMS_SUCCESS = 'FETCH_PROGRAMS_SUCCESS',
    FETCH_ALL_PROGRAMS_SUCCESS = 'FETCH_ALL_PROGRAMS_SUCCESS',
    FETCH_PROGRAMS_ERROR = 'FETCH_PROGRAMS_ERROR',
    FETCH_PROGRAM = 'FETCH_PROGRAM',
    FETCH_PROGRAM_SUCCESS = 'FETCH_PROGRAM_SUCCESS',
    FETCH_PROGRAM_ERROR = 'FETCH_PROGRAM_ERROR',
    RESET_PROGRAMS = 'RESET_PROGRAMS',
    PROGRAM_UPLOAD_SUCCESS = 'PROGRAM_UPLOAD_SUCCESS',
    PROGRAM_UPLOAD_START = 'PROGRAM_UPLOAD_START',
    PROGRAM_UPLOAD_FAILED = 'PROGRAM_UPLOAD_FAILED',
    PROGRAM_UPLOAD_STATUS = 'PROGRAM_UPLOAD_STATUS',
    PROGRAM_UPLOAD_RESET = 'PROGRAM_UPLOAD_RESET',
    SEND_MESSAGE_START = 'SEND_MESSAGE_START',
    SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS',
    SEND_MESSAGE_STATUS = 'SEND_MESSAGE_STATUS',
    SEND_MESSAGE_FAILED = 'SEND_MESSAGE_FAILED',
    SEND_MESSAGE_RESET = 'SEND_MESSAGE_RESET'
}

interface SendMessageStartAction{
    type: ProgramActionTypes.SEND_MESSAGE_START;
}

interface SendMessageSuccessAction{
    type: ProgramActionTypes.SEND_MESSAGE_SUCCESS;
}

interface SendMessageStatusAction{
    type: ProgramActionTypes.SEND_MESSAGE_STATUS;
    payload: MessageStatusModel;
}

interface SendMessageFailedAction{
    type: ProgramActionTypes.SEND_MESSAGE_FAILED;
    payload: string;
}

interface SendMessageResetAction {
    type: ProgramActionTypes.SEND_MESSAGE_RESET
}

interface UploadProgramStartAction{
    type: ProgramActionTypes.PROGRAM_UPLOAD_START;
}

interface UploadProgramSuccessAction{
    type: ProgramActionTypes.PROGRAM_UPLOAD_SUCCESS;
}

interface UploadProgramFailedAction{
    type: ProgramActionTypes.PROGRAM_UPLOAD_FAILED;
    payload: string;
}

interface UploadProgramStatusAction{
    type: ProgramActionTypes.PROGRAM_UPLOAD_STATUS;
    payload: string;
}

interface UploadProgramResetAction{
    type: ProgramActionTypes.PROGRAM_UPLOAD_RESET;
}

interface FetchProgramsAction{
    type: ProgramActionTypes.FETCH_PROGRAMS;
}
interface FetchProgramsSuccessAction{
    type: ProgramActionTypes.FETCH_PROGRAMS_SUCCESS;
    payload: ProgramModel[];
}
interface FetchProgramsAllSuccessAction{
    type: ProgramActionTypes.FETCH_ALL_PROGRAMS_SUCCESS;
    payload: ProgramModel[];
}
interface FetchProgramsErrorAction{
    type: ProgramActionTypes.FETCH_PROGRAMS_ERROR;
    payload: string;
}

interface FetchProgramAction{
    type: ProgramActionTypes.FETCH_PROGRAM;
}

interface FetchProgramSuccessAction{
    type: ProgramActionTypes.FETCH_PROGRAM_SUCCESS;
    payload: ProgramModel;
}

interface FetchProgramErrorAction{
    type: ProgramActionTypes.FETCH_PROGRAM_ERROR;
    payload: string;
}

interface ResetProgramsAction{
    type: ProgramActionTypes.RESET_PROGRAMS
}

export type ProgramAction = 
    FetchProgramsAction | 
    FetchProgramsErrorAction | 
    FetchProgramsSuccessAction | 
    FetchProgramAction | 
    FetchProgramSuccessAction | 
    FetchProgramsAllSuccessAction |
    FetchProgramErrorAction | 
    UploadProgramStartAction |
    UploadProgramSuccessAction |
    UploadProgramFailedAction |
    UploadProgramStatusAction |
    UploadProgramResetAction |
    SendMessageStartAction |
    SendMessageSuccessAction |
    SendMessageStatusAction |
    SendMessageFailedAction |
    SendMessageResetAction |
    ResetProgramsAction;