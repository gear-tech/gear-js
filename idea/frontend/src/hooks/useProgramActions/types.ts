import { Hex, Metadata } from '@gear-js/api';

import { OperationCallbacks, ParamsToSignAndSend } from 'entities/hooks';

type Payload = {
  value: number;
  title?: string;
  gasLimit: number;
  metadata?: Metadata;
  metadataBuffer?: string;
  initPayload: string;
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

type ParamsToUpload = OperationCallbacks & DataToUpload;

type ParamsToCreate = OperationCallbacks & DataToCreate;

type ParamsToSignAndUpload = ParamsToSignAndSend & {
  method: string;
  name: string;
  title?: string;
  payload: Payload;
  programId: Hex;
};

export type { Payload, ParamsToUpload, ParamsToCreate, ParamsToSignAndUpload };
