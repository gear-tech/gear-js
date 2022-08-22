import { AnyJson } from '@polkadot/types/types';
import { Hex, Metadata } from '@gear-js/api';

import { OperationCallbacks, ParamsToSignAndSend } from 'types/hooks';

export type Payload = {
  value: number;
  title?: string;
  gasLimit: number;
  metadata?: Metadata;
  metadataBuffer?: string;
  initPayload: AnyJson;
  programName?: string;
  payloadType?: string;
};

type DataToUpload = {
  file: File;
  payload: Payload;
};

type DataToCreate = {
  codeId: Hex;
  payload: Payload;
};

export type ParamsToUpload = OperationCallbacks & DataToUpload;

export type ParamsToCreate = OperationCallbacks & DataToCreate;

export type ParamsToSignAndUpload = ParamsToSignAndSend & {
  name: string;
  title: string;
  payload: Payload;
  programId: string;
};
