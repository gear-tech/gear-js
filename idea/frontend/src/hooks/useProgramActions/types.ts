import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import { OperationCallbacks, ParamsToSignAndSend } from 'entities/hooks';

type Payload = {
  value: number;
  gasLimit: number;
  metaHex?: HexString;
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
  codeId: HexString;
  payload: Payload;
};

type ParamsToUpload = OperationCallbacks & DataToUpload;

type ParamsToCreate = OperationCallbacks & DataToCreate;

type ParamsToSignAndUpload = ParamsToSignAndSend & {
  method: string;
  name: string;
  payload: Payload;
  programId: HexString;
};

export type { Payload, ParamsToUpload, ParamsToCreate, ParamsToSignAndUpload };
