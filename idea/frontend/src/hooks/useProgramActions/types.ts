import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import { OperationCallbacks, ParamsToSignAndSend } from '@/entities/hooks';

type Payload = {
  value: string;
  gasLimit: string;
  initPayload: string;
  keepAlive: boolean;
  metaHex?: HexString;
  metadata?: ProgramMetadata | undefined;
  programName: string;
  payloadType?: string;
  idl?: string;
};

type DataToUpload = {
  optBuffer: Buffer;
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
  payload: Payload;
  programId: HexString;
  codeId: HexString;
};

export type { Payload, ParamsToUpload, ParamsToCreate, ParamsToSignAndUpload };
