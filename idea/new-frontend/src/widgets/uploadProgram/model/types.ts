import { Metadata } from '@gear-js/api';

import { PayloadValue } from 'entities/formPayload';

type FormValues = {
  value: number;
  payload: PayloadValue;
  gasLimit: number;
  programName: string;
  payloadType: string;
};

type UploadProgramProps = {
  file?: File;
  metadata?: Metadata;
  metadataBuffer?: string;
};

export type { UploadProgramProps, FormValues };
