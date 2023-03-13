const API_URL = process.env.REACT_APP_API_URL as string;
const NODE_ADDRESS = process.env.REACT_APP_NODE_ADDRESS as string;
const DEFAULT_NODES_URL = process.env.REACT_APP_DEFAULT_NODES_URL as string;
const HCAPTCHA_SITE_KEY = process.env.REACT_APP_HCAPTCHA_SITE_KEY as string;

const WASM_COMPILER_GET = `${process.env.REACT_APP_WASM_COMPILER_URL}/get-wasm`;
const WASM_COMPILER_BUILD = `${process.env.REACT_APP_WASM_COMPILER_URL}/build`;

const NODE_ADRESS_URL_PARAM = 'node';

const EXAMPLES_HREF = 'https://www.gear-tech.io/developers';

const DEFAULT_LIMIT = 20;
const GEAR_BALANCE_TRANSFER_VALUE = +(process.env.REACT_APP_DEFAULT_TRANSFER_BALANCE_VALUE as string);

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

const UPLOAD_METADATA_TIMEOUT = 2000;

enum LocalStorage {
  Node = 'node',
  Nodes = 'nodes',
  Account = 'account',
  Genesis = 'genesis',
  HideWelcomeBanner = 'hide_welcome_banner',
  Wallet = 'wallet',
  IsNewUser = 'isNewUser',
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
  AddMetadata = 'program.meta.add',
  AddCodeMetadata = 'code.meta.add',
  GetMetadata = 'program.meta.get',
  GetCodeMetadata = 'code.meta.get',
  GetMessage = 'message.data',
  GetAllMessages = 'message.all',
  GetCode = 'code.data',
  GetAllCodes = 'code.all',
  GetTestBalance = 'testBalance.get',
  NetworkData = 'networkData.available',
  TestBalanceAvailable = 'testBalance.available',
  AddState = 'program.state.add',
  GetStates = 'program.state.all',
  GetState = 'program.state.get',
}

enum FileTypes {
  Wasm = 'application/wasm',
  Json = 'application/json',
  Text = 'text/plain',
}

enum AnimationTimeout {
  Tiny = 50,
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
  NODE_ADRESS_URL_PARAM,
  EXAMPLES_HREF,
  DEFAULT_LIMIT,
  GEAR_BALANCE_TRANSFER_VALUE,
  ACCOUNT_ERRORS,
  PROGRAM_ERRORS,
  UPLOAD_METADATA_TIMEOUT,
  LocalStorage,
  GasMethod,
  TransactionName,
  TransactionStatus,
  RpcMethods,
  FileTypes,
  AnimationTimeout,
};
