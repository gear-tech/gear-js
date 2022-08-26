import { rpcService } from 'shared/services/rpcService';
import { RpcMethods } from 'shared/config';

import { AddMedatataParams, FetchMetadataResponse } from './types';

const addMetadata = (params: AddMedatataParams) => rpcService.callRPC(RpcMethods.AddMetadata, params);

const fetchMetadata = (programId: string) =>
  rpcService.callRPC<FetchMetadataResponse>(RpcMethods.GetMetadata, { programId });

export { addMetadata, fetchMetadata };
