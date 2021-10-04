import { Metadata } from '@gear-js/api/types';
import { KeyringPair$Json } from '@polkadot/keyring/types';

export interface UploadProgramData {
  gasLimit: number;
  value: number;
  file: Buffer;
  filename: string;
  initPayload?: string | number | JSON;
  salt?: string;
  keyPairJson?: KeyringPair$Json;
  meta?: Metadata;
}

export interface SendMessageData {
  destination: string;
  payload: string;
  gasLimit: number;
  value: number;
  keyPairJson?: KeyringPair$Json;
}
