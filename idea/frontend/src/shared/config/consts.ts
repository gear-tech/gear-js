import { decodeAddress } from '@gear-js/api';
import { z } from 'zod';

import { isAccountAddressValid } from '../helpers';

const API_URL = import.meta.env.VITE_API_URL as string;
const INDEXER_API_URL = import.meta.env.VITE_INDEXER_API_URL as string;
const NODES_API_URL = import.meta.env.VITE_NODES_API_URL as string;
const NODE_ADDRESS = import.meta.env.VITE_NODE_ADDRESS as string;
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY as string;
const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;

const GENESIS = {
  MAINNET: '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763',
  TESTNET: '0x525639f713f397dcf839bd022cd821f367ebcf179de7b9253531f8adbe5436d6',
} as const;

const VOUCHERS_API_URL = {
  [GENESIS.MAINNET]: import.meta.env.VITE_MAINNET_VOUCHERS_API_URL as string,
  [GENESIS.TESTNET]: import.meta.env.VITE_TESTNET_VOUCHERS_API_URL as string,
} as const;

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
  AddMetadata = 'meta.add',
  GetMetadata = 'meta.get',
}

enum FileTypes {
  Wasm = 'application/wasm',
  Json = 'application/json',
  Text = 'text/plain',
  Idl = '.idl',
}

enum AnimationTimeout {
  Tiny = 50,
  Small = 150,
  Default = 250,
  Medium = 400,
  Big = 1000,
}

const ACCOUNT_ADDRESS_SCHEMA = z
  .string()
  .trim()
  .min(0)
  .refine((value) => isAccountAddressValid(value), 'Invalid address')
  .transform((value) => decodeAddress(value));

export {
  API_URL,
  INDEXER_API_URL,
  VOUCHERS_API_URL,
  NODES_API_URL,
  NODE_ADDRESS,
  HCAPTCHA_SITE_KEY,
  GTM_ID,
  NODE_ADRESS_URL_PARAM,
  EXAMPLES_HREF,
  DEFAULT_LIMIT,
  GEAR_BALANCE_TRANSFER_VALUE,
  ACCOUNT_ERRORS,
  PROGRAM_ERRORS,
  GENESIS,
  ACCOUNT_ADDRESS_SCHEMA,
  LocalStorage,
  GasMethod,
  TransactionName,
  TransactionStatus,
  RpcMethods,
  FileTypes,
  AnimationTimeout,
};
