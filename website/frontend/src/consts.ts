export const GEAR_LOCAL_IDE_URI = process.env.REACT_APP_IDE_URI;
export const API_CONNECTION_ADDRESS = process.env.REACT_APP_API_CONNECT_ADDRESS;
export const API_PATH = process.env.REACT_APP_API_PATH!;
export const isProd = process.env.NODE_ENV === 'production';
export const JSONRPC_VERSION = '2.0';
export const INITIAL_LIMIT_BY_PAGE = 13;
export const GEAR_BALANCE_TRANSFER_VALUE = 10_000_000_000;

export const PROGRAM_ERRORS = {
  UNAUTHORIZED: 'Unauthorized',
  INVALID_PARAMS: 'Invalid method parameters',
  INVALID_TRANSACTION: 'Invalid transaction',
  PROGRAM_INIT_FAILED: 'Program initialization failed',
  GEAR_NODE_ERROR: 'Gear node error',
  BALANCE_LOW: 'Invalid transaction. Account balance too low',
  PAYLOAD_ERROR: 'payload.toHex is not a function',
};

export const PROGRESS_BAR_STATUSES = {
  READY: 'READY',
  START: 'START',
  COMPLETED: 'COMPLETED',
};

export const PROGRAM_UPLOAD_STATUSES = {
  IN_BLOCK: 'in block',
  FINALIZED: 'finalized',
  PROGRAM_INITIALIZED: 'program initialized',
};

export const EVENT_TYPES = {
  PROGRAM_INITIALIZED: 'ProgramInitialized',
  PROGRAM_INITIALIZATION_FAILURE: 'InitFailure',
  LOG: 'log',
};

export const SOCKET_RESULT_STATUSES = {
  IN_BLOCK: 'InBlock',
  FINALIZED: 'Finalized',
  PROGRAM_INITIALIZED: 'ProgramInitialized',
  SUCCESS: 'Success',
  LOG: 'Log',
};

export const RPC_METHODS = {
  PROGRAM_UPLOAD: 'program.upload',
  PROGRAM_DATA: 'program.data',
  PROGRAM_ALL: 'program.all',
  TOTAL_ISSUANCE: 'system.totalIssuance',
  SUBSCRIBE_BLOCKS: 'blocks.newBlocks',
  UNSUBSCRIBE_BLOCKS: 'blocks.unsubscribe',
  SUBSCRIBE_EVENTS: 'events.subscribe',
  BALANCE_TRANSFER: 'balance.topUp',
  SEND_MESSAGE: 'message.send',
  SEND_META: 'program.addMeta',
  GET_GAS_SPENT: 'message.gasSpent',
  GET_PAYLOAD_TYPE: 'message.payloadType',
  READ_EVENTS: 'events.subscribe',
  ADD_PUBLIC: 'user.addPublicKey',
  ADD_METADATA: 'program.addMeta',
  GET_METADATA: 'program.getMeta',
};

export const EDITOR_DROPDOWN = ['Empty Rust template'];

export const SWITCH_PAGE_TYPES = {
  UPLOAD_PROGRAM: 'UPLOAD_PROGRAM',
  UPLOADED_PROGRAMS: 'UPLOADED_PROGRAMS',
  NOTIFICATIONS: 'NOTIFICATIONS',
  ALL_PROGRAMS: 'ALL_PROGRAMS',
};

export const PAGE_TYPES = {
  MESSAGE_FORM_PAGE: 'MESSAGE_FORM_PAGE',
  EDITOR_PAGE: 'EDITOR_PAGE',
  META_FORM_PAGE: 'META_FORM_PAGE',
  NOTIFICATION_INFO: 'NOTIFICATION_INFO',
};

export const EDITOR_BTNS = {
  BUILD: 'BUILD',
  DOWNLOAD: 'DOWNLOAD',
  RUN: 'RUN',
  BUILD_RUN: 'BUILD_RUN',
};

export const SEARCH_TYPES = {
  NOTIFICATIONS: 'NOTIFICATIONS',
  PROGRAMS: 'PROGRAMS',
};

export const KEY_TYPES = {
  MNEMOINIC: 'mnemonic',
  RAW: 'raw',
};

export enum ZIndexes {
  'alert' = 999,
}
