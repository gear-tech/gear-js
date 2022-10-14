import { Signer } from '@polkadot/api/types';
import { Metadata } from '@gear-js/api';

import { OperationCallbacks, ParamsToSignAndSend } from 'entities/hooks';

type ParamsToUploadMeta = Partial<OperationCallbacks> & {
  name: string;
  title?: string;
  signer?: Signer;
  metadata?: Metadata;
  programId: string;
  metadataBuffer?: string;
};

type ParamsToSignAndUpload = Partial<OperationCallbacks> &
  Omit<ParamsToSignAndSend, 'reject' | 'resolve'> &
  Omit<ParamsToUploadMeta, 'metadata'> & {
    jsonMeta?: string;
  };

export type { ParamsToUploadMeta, ParamsToSignAndUpload };
