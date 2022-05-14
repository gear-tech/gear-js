export const NODE_ADDRESS = process.env.REACT_APP_NODE_ADDRESS as string;
export const NODE_ADRESS_URL_PARAM = 'node';
export const DEFAULT_NODES_URL = process.env.REACT_APP_DEFAULT_NODES_URL as string;

export const API_URL = process.env.REACT_APP_API_URL as string;
export const WASM_COMPILER_BUILD = `${process.env.REACT_APP_WASM_COMPILER_URL}/build`;
export const WASM_COMPILER_GET = `${process.env.REACT_APP_WASM_COMPILER_URL}/get-wasm`;

export const isProd = process.env.NODE_ENV === 'production';
export const INITIAL_LIMIT_BY_PAGE = 13;
export const GEAR_BALANCE_TRANSFER_VALUE = 10_000_000_000;
export const MIN_GAS_LIMIT = 20_000_000;

export const HCAPTCHA_SITE_KEY = process.env.REACT_APP_HCAPTCHA_SITE_KEY as string;

export const LOCAL_STORAGE = {
  CHAIN: 'chain',
  GENESIS: 'genesis',
  NODES: 'nodes',
  NODE_ADDRESS: 'node_address',
  PUBLIC_KEY_RAW: 'public_key_raw',
  PROGRAM_COMPILE_ID: 'program_compile_id',
  SAVED_ACCOUNT: 'saved_account',
  EVENT_FILTERS: 'eventFilters',
};

export const PROGRAM_ERRORS = {
  UNAUTHORIZED: 'Unauthorized',
  INVALID_PARAMS: 'Invalid method parameters',
  INVALID_TRANSACTION: 'Transaction error. Status: isInvalid',
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
  PROGRAMS_ALL: 'program.all',
  PROGRAMS_USER: 'program.allUser',
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
  ADD_METADATA: 'program.meta.add',
  GET_METADATA: 'program.meta.get',
  GET_TEST_BALANCE: 'testBalance.get',
  GET_ALL_MESSAGES: 'message.all',
  GET_MESSAGE: 'message.data',
};

export const SWITCH_PAGE_TYPES = {
  UPLOAD_PROGRAM: 'UPLOAD_PROGRAM',
  UPLOADED_PROGRAMS: 'UPLOADED_PROGRAMS',
  ALL_PROGRAMS: 'ALL_PROGRAMS',
  ALL_MESSAGES: 'ALL_MESSAGES',
};

export const PAGE_TYPES = {
  MESSAGE_FORM_PAGE: 'MESSAGE_FORM_PAGE',
  EDITOR_PAGE: 'EDITOR_PAGE',
  META_FORM_PAGE: 'META_FORM_PAGE',
};

export const EDITOR_BTNS = {
  BUILD: 'BUILD',
  DOWNLOAD: 'DOWNLOAD',
  RUN: 'RUN',
  BUILD_RUN: 'BUILD_RUN',
};

export const KEY_TYPES = {
  MNEMOINIC: 'mnemonic',
  RAW: 'raw',
};

export const DEVELOPMENT_CHAIN = 'Development';

export const URL_PARAMS = {
  PAGE: 'page',
  QUERY: 'query',
};

export enum ZIndexes {
  'alert' = 999,
}
