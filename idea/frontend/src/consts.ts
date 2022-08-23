export const NODE_ADDRESS = process.env.REACT_APP_NODE_ADDRESS as string;
export const NODE_ADRESS_URL_PARAM = 'node';
export const DEFAULT_NODES_URL = process.env.REACT_APP_DEFAULT_NODES_URL as string;

export const API_URL = process.env.REACT_APP_API_URL as string;
export const WASM_COMPILER_BUILD = `${process.env.REACT_APP_WASM_COMPILER_URL}/build`;
export const WASM_COMPILER_GET = `${process.env.REACT_APP_WASM_COMPILER_URL}/get-wasm`;

export const isProd = process.env.NODE_ENV === 'production';
export const INITIAL_LIMIT_BY_PAGE = 13;
export const GEAR_BALANCE_TRANSFER_VALUE = 10_000_000_000;
export const MIN_GAS_LIMIT = 1_000_000_000;

export const HCAPTCHA_SITE_KEY = process.env.REACT_APP_HCAPTCHA_SITE_KEY as string;

export const LOCAL_STORAGE = {
  CHAIN: 'chain',
  GENESIS: 'genesis',
  NODES: 'nodes',
  NODE_ADDRESS: 'node_address',
  PUBLIC_KEY_RAW: 'public_key_raw',
  PROGRAM_COMPILE_ID: 'program_compile_id',
  EVENT_FILTERS: 'eventFilters',
  ACCOUNT: 'account',
};

export const ACCOUNT_ERRORS = {
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  WALLET_BALLANCE_IS_ZERO: 'Wallet balance is zero',
  NOT_ENOUGH_FUNDS_IN_WALLET: 'Not enough funds in the wallet',
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

export enum TransactionStatus {
  Ready = 'Ready',
  InBlock = 'InBlock',
  IsInvalid = 'IsInvalid',
  Finalized = 'Finalized',
}

export enum GasMethod {
  Reply = 'reply',
  Handle = 'handle',
  InitCreate = 'initCreate',
  InitUpdate = 'initUpdate',
}

export enum TransactionName {
  SendReply = 'gear.sendReply',
  SendMessage = 'gear.sendMessage',
  ClaimMessage = 'gear.claimValueFromMailbox',
  SubmitCode = 'gear.submitCode',
  CreateProgram = 'gear.createProgram',
  UploadProgram = 'gear.uploadProgram',
}

export const RPC_METHODS = {
  PROGRAM_DATA: 'program.data',
  PROGRAMS_ALL: 'program.all',
  PROGRAMS_USER: 'program.all.user',
  ADD_METADATA: 'program.meta.add',
  GET_METADATA: 'program.meta.get',
  GET_MESSAGE: 'message.data',
  GET_ALL_MESSAGES: 'message.all',
  GET_CODE: 'code.data',
  GET_ALL_CODES: 'code.all',
  GET_TEST_BALANCE: 'testBalance.get',
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

export const DEVELOPMENT_CHAIN = 'Development';

export const URL_PARAMS = {
  PAGE: 'page',
  QUERY: 'query',
};

export const FILE_TYPES = {
  WASM: 'application/wasm',
  JSON: 'application/json',
};
