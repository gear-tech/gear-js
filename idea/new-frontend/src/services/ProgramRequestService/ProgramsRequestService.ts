import { RpcMethods } from 'shared/config';
import { RPCService } from 'shared/services/rpcService';
import { ProgramModel } from 'entities/program';

import { PaginationModel } from '../types';
import { FetchUserProgramsParams, ProgramPaginationModel } from './types';

class ProgramRequestService {
  apiRequest = new RPCService();

  public fetchAllPrograms = (params: PaginationModel) =>
    this.apiRequest.callRPC<ProgramPaginationModel>(RpcMethods.GetAllPrograms, params);

  public fetchUserPrograms = (params: FetchUserProgramsParams) =>
    this.apiRequest.callRPC<ProgramPaginationModel>(RpcMethods.GetUserPrograms, params);

  public fetchProgram = (id: string) => this.apiRequest.callRPC<ProgramModel>(RpcMethods.GetProgram, { id });
}

export { ProgramRequestService };
