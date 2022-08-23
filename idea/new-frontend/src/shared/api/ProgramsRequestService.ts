import { RpcMethods } from 'shared/config';
import { GetMetaResponse } from 'shared/types/api';
import { PaginationModel, UserPrograms } from 'shared/types/common';
import { ProgramModel, ProgramPaginationModel } from 'shared/types/program';

import { ServerRPCRequestService } from './ServerRPCRequestService';

class ProgramRequestService {
  apiRequest = new ServerRPCRequestService();

  public fetchAllPrograms = (params: PaginationModel) =>
    this.apiRequest.callRPC<ProgramPaginationModel>(RpcMethods.GetAllPrograms, { ...params });

  public fetchUserPrograms = (params: UserPrograms) =>
    this.apiRequest.callRPC<ProgramPaginationModel>(RpcMethods.GetUserPrograms, { ...params });

  public fetchProgram = (id: string) => this.apiRequest.callRPC<ProgramModel>(RpcMethods.GetProgram, { id });

  public fetchMeta = (programId: string) =>
    this.apiRequest.callRPC<GetMetaResponse>(RpcMethods.GetMetadata, { programId });
}

export const programService = new ProgramRequestService();
