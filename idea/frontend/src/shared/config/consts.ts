const API_URL = import.meta.env.VITE_API_URL as string;
const VOUCHERS_API_URL = import.meta.env.VITE_VOUCHERS_API_URL as string;
const NODES_API_URL = import.meta.env.VITE_NODES_API_URL as string;
const NODE_ADDRESS = import.meta.env.VITE_NODE_ADDRESS as string;
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY as string;

const NODE_ADRESS_URL_PARAM = 'node';

const EXAMPLES_HREF = 'https://www.gear-tech.io/developers';

const DEFAULT_LIMIT = 20;
const GEAR_BALANCE_TRANSFER_VALUE = import.meta.env.VITE_DEFAULT_TRANSFER_BALANCE_VALUE as string;

const ACCOUNT_ERRORS = {
  WALLET_NOT_CONNECTED: 'Wallet not connected',
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
  AddMetadata = 'meta.add',
  AddProgramName = 'program.name.add',
  AddCodeName = 'code.name.add',
  GetMetadata = 'meta.get',
  GetMessage = 'message.data',
  GetAllMessages = 'message.all',
  GetCode = 'code.data',
  GetAllCodes = 'code.all',
  GetTestBalance = 'testBalance.get',
  NetworkData = 'networkData.available',
  TestBalanceAvailable = 'testBalance.available',
  AddState = 'program.state.add',
  GetStates = 'program.state.all',
  GetState = 'state.get',
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
  VOUCHERS_API_URL,
  NODES_API_URL,
  NODE_ADDRESS,
  HCAPTCHA_SITE_KEY,
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
