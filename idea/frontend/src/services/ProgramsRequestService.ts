import { PaginationModel, UserPrograms } from 'types/common';
import { ProgramModel, ProgramPaginationModel } from 'types/program';
import { GetMetaResponse } from 'types/api';
import { RPC_METHODS } from 'consts';
import ServerRPCRequestService from './ServerRPCRequestService';

class ProgramRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_PROGRAMS_ALL = RPC_METHODS.PROGRAMS_ALL;

  protected readonly API_PROGRAMS_USER = RPC_METHODS.PROGRAMS_USER;

  protected readonly API_REFRESH_PROGRAM = RPC_METHODS.PROGRAM_DATA;

  protected readonly GET_METADATA = RPC_METHODS.GET_METADATA;

  public fetchAllPrograms = (params: PaginationModel) => {
    return this.apiRequest.callRPC<ProgramPaginationModel>(this.API_PROGRAMS_ALL, { ...params });
  };

  public fetchUserPrograms = (params: UserPrograms) => {
    return this.apiRequest.callRPC<ProgramPaginationModel>(this.API_PROGRAMS_USER, { ...params });
  };

  public fetchProgram = (id: string) => {
    return this.apiRequest.callRPC<ProgramModel>(this.API_REFRESH_PROGRAM, { id });
  };

  public fetchMeta = (programId: string) => {
    return this.apiRequest.callRPC<GetMetaResponse>(this.GET_METADATA, { programId });
  };
}

export const programService = new ProgramRequestService();
