import { Hex, ProgramMetadata } from '@gear-js/api';

import { OperationCallbacks, ParamsToSignAndSend } from 'entities/hooks';

type Payload = {
  value: number;
  gasLimit: number;
  metaHex?: Hex;
  metadata?: ProgramMetadata | undefined;
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
  payload: Payload;
  programId: Hex;
};

export type { Payload, ParamsToUpload, ParamsToCreate, ParamsToSignAndUpload };
