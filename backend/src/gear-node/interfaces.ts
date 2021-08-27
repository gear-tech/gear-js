import { KeyringPair$Json } from '@polkadot/keyring/types';

export interface UploadProgramData {
  gasLimit: number;
  value: number;
  file: Buffer;
  filename: string;
  initPayload?: string | number | JSON;
  salt?: string;
  keyPairJson?: KeyringPair$Json;
  meta?: Buffer;
  initType?: string | JSON;
  initOutType?: string | JSON;
  incomingType?: string | JSON;
  expectedType?: string | JSON;
}

export interface SendMessageData {
  destination: string;
  payload: string | JSON | number;
  gasLimit: number;
  value: number;
  keyPairJson?: KeyringPair$Json;
}

