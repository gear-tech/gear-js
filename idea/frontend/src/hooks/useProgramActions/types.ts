import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import { OperationCallbacks, ParamsToSignAndSend } from 'entities/hooks';

type Payload = {
  value: string;
  gasLimit: string;
  metaHex?: HexString;
  metadata?: ProgramMetadata | undefined;
  initPayload: string;
  programName?: string;
  payloadType?: string;
};

type DataToUpload = {
  optBuffer: Buffer;
  name: string;
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
  name?: string;
  payload: Payload;
  programId: HexString;
};

export type { Payload, ParamsToUpload, ParamsToCreate, ParamsToSignAndUpload };
