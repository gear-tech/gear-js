import { RPCService } from 'shared/services/rpcService';
import { RpcMethods } from 'shared/config';

import { AddMedatataParams, FetchMetadataResponse } from './types';

class MetadataRequestService {
  apiRequest = new RPCService();

  public addMetadata = (params: AddMedatataParams) => this.apiRequest.callRPC(RpcMethods.AddMetadata, params);

  public fetchMetadata = (programId: string) =>
    this.apiRequest.callRPC<FetchMetadataResponse>(RpcMethods.GetMetadata, { programId });
}

export { MetadataRequestService };
