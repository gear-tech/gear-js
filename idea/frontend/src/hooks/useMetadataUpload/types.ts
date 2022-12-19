import { Signer } from '@polkadot/api/types';
import { ProgramMetadata } from '@gear-js/api';

import { OperationCallbacks, ParamsToSignAndSend } from 'entities/hooks';

type ParamsToUploadMeta = Partial<OperationCallbacks> & {
  name: string;
  title?: string;
  signer?: Signer;
  metadata?: ProgramMetadata;
  programId: string;
  metadataBuffer?: string;
};

type ParamsToSignAndUpload = Partial<OperationCallbacks> &
  Omit<ParamsToSignAndSend, 'reject' | 'resolve'> &
  Omit<ParamsToUploadMeta, 'metadata'> & {
    jsonMeta?: string;
  };

export type { ParamsToUploadMeta, ParamsToSignAndUpload };
