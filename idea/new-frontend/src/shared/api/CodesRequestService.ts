import { RpcMethods } from 'shared/config';
import { PaginationModel } from 'shared/types/common';
import { CodeModel, CodePaginationModel } from 'shared/types/code';

import { ServerRPCRequestService } from './ServerRPCRequestService';

class CodesRequestService {
  apiRequest = new ServerRPCRequestService();

  public fetchCode = (codeId: string) => this.apiRequest.callRPC<CodeModel>(RpcMethods.GetCode, { codeId });

  public fetchCodes = (params: PaginationModel) =>
    this.apiRequest.callRPC<CodePaginationModel>(RpcMethods.GetAllCodes, params);
}

export const codesService = new CodesRequestService();
