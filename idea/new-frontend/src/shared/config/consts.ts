const API_URL = process.env.REACT_APP_API_URL as string;
const NODE_ADDRESS = process.env.REACT_APP_NODE_ADDRESS as string;
const DEFAULT_NODES_URL = process.env.REACT_APP_DEFAULT_NODES_URL as string;
const HCAPTCHA_SITE_KEY = process.env.REACT_APP_HCAPTCHA_SITE_KEY as string;

const WASM_COMPILER_GET = `${process.env.REACT_APP_WASM_COMPILER_URL}/get-wasm`;
const WASM_COMPILER_BUILD = `${process.env.REACT_APP_WASM_COMPILER_URL}/build`;

const DEVELOPMENT_CHAIN = 'Development';
const NODE_ADRESS_URL_PARAM = 'node';

const EXAMPLES_HREF = 'https://www.gear-tech.io/developers';

const DEFAULT_LIMIT = 20;
const GEAR_BALANCE_TRANSFER_VALUE = 10_000_000_000;

const ACCOUNT_ERRORS = {
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  WALLET_BALLANCE_IS_ZERO: 'Wallet balance is zero',
  NOT_ENOUGH_FUNDS_IN_WALLET: 'Not enough funds in the wallet',
};

const PROGRAM_ERRORS = {
  BALANCE_LOW: 'Invalid transaction. Account balance too low',
  UNAUTHORIZED: 'Unauthorized',
  PAYLOAD_ERROR: 'payload.toHex is not a function',
  INVALID_PARAMS: 'Invalid method parameters',
  GEAR_NODE_ERROR: 'Gear node error',
  INVALID_TRANSACTION: 'Transaction error. Status: isInvalid',
  PROGRAM_INIT_FAILED: 'Program initialization failed',
};

enum LocalStorage {
  Nodes = 'nodes',
  Chain = 'chain',
  Account = 'account',
  Genesis = 'genesis',
  NewUser = 'new_user',
  PublicKeyRaw = 'public_key_raw',
  HideWelcomeBanner = 'hide_welcome_banner',
}

enum GasMethod {
  Reply = 'reply',
  Handle = 'handle',
  InitCreate = 'initCreate',
  InitUpdate = 'initUpdate',
}

enum TransactionName {
  SendReply = 'gear.sendReply',
  SendMessage = 'gear.sendMessage',
  ClaimMessage = 'gear.claimValueFromMailbox',
  SubmitCode = 'gear.submitCode',
  CreateProgram = 'gear.createProgram',
  UploadProgram = 'gear.uploadProgram',
}

enum TransactionStatus {
  Ready = 'Ready',
  InBlock = 'InBlock',
  IsInvalid = 'IsInvalid',
  Finalized = 'Finalized',
}

enum RpcMethods {
  GetProgram = 'program.data',
  GetAllPrograms = 'program.all',
  GetUserPrograms = 'program.all.user',
  AddMetadata = 'program.meta.add',
  GetMetadata = 'program.meta.get',
  GetMessage = 'message.data',
  GetAllMessages = 'message.all',
  GetCode = 'code.data',
  GetAllCodes = 'code.all',
  GetTestBalance = 'testBalance.get',
}

enum FileTypes {
  Wasm = 'application/wasm',
  Json = 'application/json',
}

enum AnimationTimeout {
  Small = 150,
  Default = 250,
  Medium = 400,
  Big = 1000,
}

export {
  API_URL,
  NODE_ADDRESS,
  DEFAULT_NODES_URL,
  HCAPTCHA_SITE_KEY,
  WASM_COMPILER_GET,
  WASM_COMPILER_BUILD,
  DEVELOPMENT_CHAIN,
  NODE_ADRESS_URL_PARAM,
  EXAMPLES_HREF,
  DEFAULT_LIMIT,
  GEAR_BALANCE_TRANSFER_VALUE,
  ACCOUNT_ERRORS,
  PROGRAM_ERRORS,
  LocalStorage,
  GasMethod,
  TransactionName,
  TransactionStatus,
  RpcMethods,
  FileTypes,
  AnimationTimeout,
};
