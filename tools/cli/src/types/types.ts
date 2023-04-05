import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

export interface IProgram extends Omit<SchemeProgram, 'id' | 'path_to_meta' | 'path_to_wasm'> {
  address?: HexString;
  meta?: ProgramMetadata;
  wasm?: Buffer;
}

export interface ICode extends Omit<SchemeCode, 'id'> {
  hash?: HexString;
}

export interface SchemeProgram {
  id: number;
  name?: string;
  path_to_wasm?: string;
  path_to_meta?: string;
  payload?: any;
  value?: number;
  address?: HexString;
}

export interface SchemeCode {
  id: number;
  name?: string;
  path_to_wasm?: string;
  hash?: HexString;
}

export interface UploadProgramTransactionScheme {
  type: 'upload_program';
  program: number;
  account: string;
  payload: any;
  value?: number;
  increase_gas?: number;
  payload_type?: string;
}

export interface SendMessageTransactionScheme {
  type: 'send_message';
  program: number;
  account: string;
  payload: any;
  value?: number;
  increase_gas?: number;
  payload_type?: string;
}

export interface UploadCodeTransactionScheme {
  type: 'upload_code';
  code: number;
  account: string;
}

export type SchemeTransaction =
  | SendMessageTransactionScheme
  | UploadCodeTransactionScheme
  | UploadProgramTransactionScheme;

export interface IScheme {
  wsAddress: `ws://${string}` | `wss://${string}`;
  accounts: Record<string, string>;
  prefunded_account?: string;
  fund_accounts?: Record<string, number>;
  programs: Array<SchemeProgram>;
  codes?: Array<SchemeCode>;
  transactions: Array<SchemeTransaction>;
}
