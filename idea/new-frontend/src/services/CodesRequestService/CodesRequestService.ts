import { RpcMethods } from 'shared/config';
import { RPCService } from 'shared/services/rpcService';
import { CodeModel } from 'entities/code';

import { PaginationModel } from '../types';
import { CodePaginationModel } from './types';

class CodesRequestService {
  apiRequest = new RPCService();

  public fetchCode = (codeId: string) => this.apiRequest.callRPC<CodeModel>(RpcMethods.GetCode, { codeId });

  public fetchCodes = (params: PaginationModel) =>
    this.apiRequest.callRPC<CodePaginationModel>(RpcMethods.GetAllCodes, params);
}

export { CodesRequestService };
