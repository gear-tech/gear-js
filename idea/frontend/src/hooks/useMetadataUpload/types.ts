import { Signer } from '@polkadot/api/types';
import { Metadata } from '@gear-js/api';

import { OperationCallbacks, SignAndSendArg as CommonSignAndSend } from 'types/hooks';

export type UploadMetaParams = Partial<OperationCallbacks> & {
  name: string;
  title?: string;
  signer?: Signer;
  metadata: Metadata;
  programId: string;
  metadataBuffer: string | null;
};

export type SignAndSend = Partial<OperationCallbacks> &
  Omit<CommonSignAndSend, 'reject' | 'resolve'> &
  Omit<UploadMetaParams, 'metadata'> & {
    jsonMeta: string;
  };
