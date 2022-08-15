import { Metadata } from '@gear-js/api';

import { OperationCallbacks, SignAndSendArg as CommonSignAndSendArg } from 'types/hooks';

export type ProgramData = {
  meta?: Metadata;
  value: number;
  title?: string;
  gasLimit: number;
  initPayload: string;
  programName?: string;
  payloadType?: string;
};

type UploadData = {
  file: File;
  programData: ProgramData;
  metadataBuffer: string | null;
};

export type UploadProgramParams = OperationCallbacks & UploadData;

export type SignAndUploadArg = CommonSignAndSendArg &
  UploadData & {
    programId: string;
  };
