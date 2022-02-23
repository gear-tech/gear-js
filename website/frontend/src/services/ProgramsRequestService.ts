import { PaginationModel, UserPrograms } from 'types/common';
import { ProgramModel, ProgramPaginationModel } from 'types/program';
import { RPC_METHODS } from 'consts';
import ServerRPCRequestService from './ServerRPCRequestService';

class ProgramRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_PROGRAM_ALL = RPC_METHODS.PROGRAM_ALL;

  protected readonly PROGRAM_ALL_USER = RPC_METHODS.PROGRAM_ALL_USER;

  protected readonly API_REFRESH_PROGRAM = RPC_METHODS.PROGRAM_DATA;

  protected readonly GET_METADATA = RPC_METHODS.GET_METADATA;

  public fetchAllPrograms = (params: PaginationModel) => {
    return this.apiRequest.callRPC<ProgramPaginationModel>(this.API_PROGRAM_ALL, { ...params });
  };

  public fetchUserPrograms = (params: UserPrograms) => {
    return this.apiRequest.callRPC<ProgramPaginationModel>(this.PROGRAM_ALL_USER, { ...params });
  };

  public fetchProgram = (id: string) => {
    return this.apiRequest.callRPC<ProgramModel>(this.API_REFRESH_PROGRAM, { id });
  };

  public fetchMeta = (id: string) => {
    return this.apiRequest.callRPC(this.GET_METADATA, { id });
  };
}

export const programService = new ProgramRequestService();
