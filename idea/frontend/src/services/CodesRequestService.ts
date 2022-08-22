import ServerRPCRequestService from './ServerRPCRequestService';

import { RPC_METHODS } from 'consts';
import { PaginationModel } from 'types/common';
import { CodeModel, CodePaginationModel } from 'types/code';

class CodesRequestService {
  apiRequest = new ServerRPCRequestService();

  public fetchCode = (codeId: string) => this.apiRequest.callRPC<CodeModel>(RPC_METHODS.GET_CODE, { codeId });

  public fetchCodes = (params: PaginationModel) =>
    this.apiRequest.callRPC<CodePaginationModel>(RPC_METHODS.GET_ALL_CODES, params);
}

export const codesService = new CodesRequestService();
